import bcrypt from 'bcryptjs'
import {
  conversationRepository,
  messageRepository,
  operatorRepository,
  operatorSessionRepository,
  personaRepository,
  subscriptionRepository,
  userRepository,
} from '../repositories'
import type {
  AdminHoursResponse,
  Agent,
  ChatHistoryEntry,
  ClockOutResponse,
  ConversationQueueRow,
  HoursResponse,
  MessageRow,
  OperatorAuth,
  OperatorSessionRow,
  OperatorTokenPayload,
  OverviewResponse,
  QueueConversation,
  WaitingConversation,
} from '../types'
import { badRequest, conflict, notFound, unauthorized } from '../utils/httpError'
import { signOperatorToken } from '../utils/jwt'
import { logger } from '../utils/logger'
import { minutesInside, startOfToday } from '../utils/time'
import { aiService } from './ai.service'

const QUEUE_LIMIT = 50
const WAITING_LIMIT = 6

// Shown when OpenAI is over quota or unavailable
const PLACEHOLDER_SUGGESTIONS = [
  "Hey, I'm here for you",
  "Tell me more, I'm listening...",
  "That's really interesting, go on 😊",
]

const toWaiting = (c: ConversationQueueRow): WaitingConversation => ({
  id: c.id,
  userName: c.users?.name || 'Unknown',
  personaId: c.persona_id,
  personaName: c.personas?.name || 'Unknown',
  messageCount: c.messages?.[0]?.count || 0,
  createdAt: c.created_at,
})

const MIN_PASSWORD_LENGTH = 6
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DAY_MS = 24 * 60 * 60 * 1000

export interface NewAgent {
  name: string
  email: string
  password: string
  role?: string
}

const checkPassword = (password: string): void => {
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw badRequest(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
  }
}

/** Minutes worked since `since` in finished sessions. The running one is timed by the dashboard itself. */
const finishedMinutesSince = (sessions: Pick<OperatorSessionRow, 'clock_in' | 'clock_out'>[], since: Date): number =>
  minutesInside(sessions, since, new Date(), false)

export const operatorService = {
  async login(email: string, password: string): Promise<OperatorAuth> {
    const operator = await operatorRepository.findByEmail(email)
    if (!operator) throw unauthorized('Invalid credentials')

    const valid = await bcrypt.compare(password, operator.password_hash)
    if (!valid) throw unauthorized('Invalid credentials')

    const identity = { id: operator.id, name: operator.name, email: operator.email, role: operator.role }
    return { ...identity, token: signOperatorToken(identity) }
  },

  /** Admins see every active conversation; agents only the ones assigned to them. */
  async getQueue(operator: OperatorTokenPayload): Promise<QueueConversation[]> {
    const conversations = await conversationRepository.findActiveQueue({
      limit: QUEUE_LIMIT,
      assignedTo: operator.role === 'admin' ? undefined : operator.id,
    })

    return conversations.map((c) => ({ ...toWaiting(c), assignedTo: c.assigned_to ?? null }))
  },

  async assignConversation(conversationId: string, operatorId: string | null): Promise<void> {
    await conversationRepository.assign(conversationId, operatorId)
  },

  listAgents(): Promise<Agent[]> {
    return operatorRepository.findAll()
  },

  /** Admin adds a new agent (or admin) account that can sign in to the dashboard. */
  async createAgent({ name, email, password, role }: NewAgent): Promise<Agent> {
    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()
    if (!cleanName) throw badRequest('Name is required')
    if (!EMAIL_PATTERN.test(cleanEmail)) throw badRequest('Enter a valid email address')
    checkPassword(password)
    if (await operatorRepository.findByEmail(cleanEmail)) throw conflict('An account with this email already exists')

    return operatorRepository.create({
      name: cleanName,
      email: cleanEmail,
      password_hash: await bcrypt.hash(password, 10),
      role: role === 'admin' ? 'admin' : 'agent',
    })
  },

  async resetAgentPassword(id: string, password: string): Promise<void> {
    checkPassword(password)
    if (!(await operatorRepository.findById(id))) throw notFound('Agent not found')
    await operatorRepository.updatePassword(id, await bcrypt.hash(password, 10))
  },

  /** Removes an account. Its chats go back to the shared queue; its clock-in history is deleted with it. */
  async deleteAgent(id: string, requestedBy: string): Promise<void> {
    if (id === requestedBy) throw badRequest('You cannot delete your own account')
    if (!(await operatorRepository.findById(id))) throw notFound('Agent not found')
    await conversationRepository.unassignOperator(id)
    await operatorRepository.remove(id)
  },

  /** AI reply suggestions for the operator handling a conversation. */
  async suggestReplies(conversationId: string, history: ChatHistoryEntry[]): Promise<string[]> {
    const conversation = await conversationRepository.findPersonaRef(conversationId)
    if (!conversation) throw notFound('Conversation not found')

    try {
      return await aiService.generateSuggestions(conversation.personas ?? conversation.persona_id, history)
    } catch (e) {
      logger.warn('[operator] Suggestions failed, using placeholders', e)
      return PLACEHOLDER_SUGGESTIONS
    }
  },

  /** An operator replies in the persona's place. */
  reply(conversationId: string, content: string): Promise<MessageRow> {
    return messageRepository.create(conversationId, 'operator', content)
  },

  /**
   * `since` is the start of the agent's own day (midnight in their time zone), sent by the dashboard.
   * The open session is looked up on its own, so a shift that began before midnight still shows as running.
   */
  async getHours(operatorId: string, since: Date = startOfToday()): Promise<HoursResponse> {
    const [sessions, open] = await Promise.all([
      operatorSessionRepository.findByOperatorOverlapping(operatorId, since.toISOString()),
      operatorSessionRepository.findOpen(operatorId),
    ])

    return {
      totalMinutesToday: finishedMinutesSince(sessions, since),
      activeSince: open?.clock_in || null,
    }
  },

  async clockIn(operatorId: string): Promise<OperatorSessionRow> {
    if (await operatorSessionRepository.findOpen(operatorId)) throw badRequest('Already clocked in')
    return operatorSessionRepository.create(operatorId)
  },

  async clockOut(operatorId: string, since: Date = startOfToday()): Promise<ClockOutResponse> {
    const open = await operatorSessionRepository.findOpen(operatorId)
    if (!open) throw badRequest('Not clocked in')

    await operatorSessionRepository.close(open.id, new Date().toISOString())

    const sessions = await operatorSessionRepository.findByOperatorOverlapping(operatorId, since.toISOString())
    return { totalMinutesToday: finishedMinutesSince(sessions, since) }
  },

  /**
   * Every agent's time on one day. The dashboard sends the day's start and end in the admin's time zone;
   * without them the server's own day is used. Shifts that cross midnight count only their part inside
   * the day, and a shift still running counts up to now.
   */
  async getAdminHours(window: { from?: Date | null; to?: Date | null; date?: string }): Promise<AdminHoursResponse> {
    let from = window.from ?? null
    let to = window.to ?? null
    if (!from || !to) {
      const day = window.date ? new Date(`${window.date}T00:00:00`) : startOfToday()
      if (Number.isNaN(day.getTime())) throw badRequest('Invalid date')
      day.setHours(0, 0, 0, 0)
      from = day
      to = new Date(day.getTime() + DAY_MS)
    }
    if (to <= from || to.getTime() - from.getTime() > 2 * DAY_MS) throw badRequest('Invalid day')

    const [operators, sessions] = await Promise.all([
      operatorRepository.findAll(),
      operatorSessionRepository.findOverlapping(from.toISOString(), to.toISOString()),
    ])

    const agents = operators.map((operator) => {
      const own = sessions.filter((s) => s.operator_id === operator.id)
      return { ...operator, totalMinutes: minutesInside(own, from, to, true), sessions: own }
    })

    return { agents, date: window.date || from.toISOString().slice(0, 10) }
  },

  /** Numbers for the admin dashboard overview. */
  async getOverview(): Promise<OverviewResponse> {
    const [members, paying, activeChats, messagesToday, personas, waiting, openSessions] = await Promise.all([
      userRepository.count(),
      subscriptionRepository.countActive(),
      conversationRepository.countActive(),
      messageRepository.countSince(startOfToday().toISOString()),
      personaRepository.findAll(),
      conversationRepository.findActiveUnassigned(WAITING_LIMIT),
      operatorSessionRepository.findAllOpenWithOperator(),
    ])

    return {
      members,
      paying,
      activeChats,
      messagesToday,
      modelsLive: personas.filter((p) => p.is_active !== false).length,
      modelsHidden: personas.filter((p) => p.is_active === false).length,
      waiting: waiting.map(toWaiting),
      onShift: openSessions.flatMap((s) =>
        s.operators ? [{ id: s.operators.id, name: s.operators.name, role: s.operators.role, since: s.clock_in }] : []
      ),
    }
  },
}
