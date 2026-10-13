import type { OperatorRole, OperatorRow, OperatorSessionRow, MessageRow } from './db.types'

export interface OperatorAuth {
  id: string
  name: string
  email: string
  role: OperatorRole
  token: string
}

export interface OperatorLoginResponse {
  operator: OperatorAuth
}

export type Agent = Pick<OperatorRow, 'id' | 'name' | 'email' | 'role' | 'created_at'>

export interface AgentResponse {
  agent: Agent
}

export interface AgentsResponse {
  agents: Agent[]
}

export interface QueueConversation {
  id: string
  userName: string
  personaId: string
  personaName: string
  messageCount: number
  createdAt: string
  assignedTo: string | null
}

export interface QueueResponse {
  conversations: QueueConversation[]
}

export type WaitingConversation = Omit<QueueConversation, 'assignedTo'>

export interface SuggestionsResponse {
  suggestions: string[]
}

export interface ReplyResponse {
  message: MessageRow
}

export interface HoursResponse {
  totalMinutesToday: number
  activeSince: string | null
}

export interface ClockInResponse {
  session: OperatorSessionRow
}

export interface ClockOutResponse {
  totalMinutesToday: number
}

export type AgentSession = Pick<OperatorSessionRow, 'operator_id' | 'clock_in' | 'clock_out'>

export interface AgentHours extends Agent {
  totalMinutes: number
  sessions: AgentSession[]
}

export interface AdminHoursResponse {
  agents: AgentHours[]
  date: string
}

export interface OnShiftAgent {
  id: string
  name: string
  role: OperatorRole
  since: string
}

export interface OverviewResponse {
  members: number
  paying: number
  activeChats: number
  messagesToday: number
  modelsLive: number
  modelsHidden: number
  waiting: WaitingConversation[]
  onShift: OnShiftAgent[]
}

/** An open clock-in session joined to the operator who owns it. */
export interface OpenSessionWithOperator {
  clock_in: string
  operators: Pick<OperatorRow, 'id' | 'name' | 'role'> | null
}
