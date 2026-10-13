import type { OperatorRole } from './auth'
import type { Message } from './chat'

export interface Agent {
  id: string
  name: string
  email: string
  role: OperatorRole
  created_at?: string
}

export interface NewAgent {
  name: string
  email: string
  password: string
  role: 'agent' | 'admin'
}

export interface AgentResponse {
  agent: Agent
}

/** An active conversation in the operator queue. */
export interface QueueConversation {
  id: string
  userName: string
  personaId: string
  personaName: string
  messageCount: number
  createdAt: string
  assignedTo: string | null
}

export type WaitingConversation = Omit<QueueConversation, 'assignedTo'>

export interface AgentSession {
  operator_id: string
  clock_in: string
  clock_out: string | null
}

export interface AgentHours extends Agent {
  totalMinutes: number
  sessions: AgentSession[]
}

export interface OnShiftAgent {
  id: string
  name: string
  role: OperatorRole
  since: string
}

export interface Overview {
  members: number
  paying: number
  activeChats: number
  messagesToday: number
  modelsLive: number
  modelsHidden: number
  waiting: WaitingConversation[]
  onShift: OnShiftAgent[]
}

export interface QueueResponse {
  conversations: QueueConversation[]
}

export interface AgentsResponse {
  agents: Agent[]
}

export interface SuggestionsResponse {
  suggestions: string[]
}

export interface ReplyResponse {
  message: Message
}

export interface HoursResponse {
  totalMinutesToday: number
  activeSince: string | null
}

export interface ClockInResponse {
  session: AgentSession & { id: string }
}

export interface ClockOutResponse {
  totalMinutesToday: number
}

export interface AdminHoursResponse {
  agents: AgentHours[]
  date: string
}
