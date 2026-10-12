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
import { badRequest, notFound, unauthorized } from '../utils/httpError'
import { signOperatorToken } from '../utils/jwt'
import { logger } from '../utils/logger'
import { minutesBetween, startOfToday } from '../utils/time'
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

/** Minutes of finished sessions. A session still running is not counted. */
const finishedMinutes = (sessions: Pick<OperatorSessionRow, 'clock_in' | 'clock_out'>[]): number =>
  sessions.reduce((sum, s) => (s.clock_out ? sum + minutesBetween(s.clock_in, s.clock_out) : sum), 0)

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

  async getHours(operatorId: string): Promise<HoursResponse> {
    const sessions = await operatorSessionRepository.findByOperatorSince(operatorId, startOfToday().toISOString())
    const active = sessions.find((s) => !s.clock_out)

    return {
      totalMinutesToday: finishedMinutes(sessions),
      activeSince: active?.clock_in || null,
    }
  },

  async clockIn(operatorId: string): Promise<OperatorSessionRow> {
    if (await operatorSessionRepository.findOpen(operatorId)) throw badRequest('Already clocked in')
    return operatorSessionRepository.create(operatorId)
  },

  async clockOut(operatorId: string): Promise<ClockOutResponse> {
    const open = await operatorSessionRepository.findOpen(operatorId)
    if (!open) throw badRequest('Not clocked in')

    await operatorSessionRepository.close(open.id, new Date().toISOString())

    const sessions = await operatorSessionRepository.findByOperatorSince(operatorId, startOfToday().toISOString())
    return { totalMinutesToday: finishedMinutes(sessions) }
  },

  /** Every agent's clock-in sessions for one day (YYYY-MM-DD, today when omitted). */
  async getAdminHours(requestedDate?: string): Promise<AdminHoursResponse> {
    const date = requestedDate || new Date().toISOString().slice(0, 10)
    const dayStart = new Date(date)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(date)
    dayEnd.setHours(23, 59, 59, 999)
    if (Number.isNaN(dayStart.getTime())) throw badRequest('Invalid date')

    const [operators, sessions] = await Promise.all([
      operatorRepository.findAll(),
      operatorSessionRepository.findStartedBetween(dayStart.toISOString(), dayEnd.toISOString()),
    ])

    const agents = operators.map((operator) => {
      const own = sessions.filter((s) => s.operator_id === operator.id)
      return { ...operator, totalMinutes: finishedMinutes(own), sessions: own }
    })

    return { agents, date }
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
