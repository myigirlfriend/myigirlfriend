import type { ConversationRow, MessageRow, PersonaRow } from './db.types'

export type ConversationWithPersona = ConversationRow & { personas: PersonaRow | null }

/** A stored fact about a member, e.g. { key: 'job', value: 'teacher' }. */
export interface MemoryFact {
  key: string
  value: string
}

/** The slice of a message the AI needs as context. */
export type ChatHistoryEntry = Pick<MessageRow, 'sender' | 'content'>

export interface StartChatResult {
  conversationId: string
  created: boolean
}

export interface StartChatResponse {
  conversationId: string
}

export interface SendMessageResponse {
  /** null when the free limit blocked the message before a reply was generated */
  message: MessageRow | null
  triggerUpsell: boolean
  reason?: 'free_limit_reached'
}

export interface HistoryResponse {
  messages: MessageRow[]
}

export interface ConversationSummary {
  id: string
  personaId: string
  createdAt: string
  lastMessage: string | null
  lastMessageAt: string
}

export interface ConversationsResponse {
  conversations: ConversationSummary[]
}

// ─── Query shapes (conversation selects with embedded relations) ───

export interface ConversationWithMessages
  extends Pick<ConversationRow, 'id' | 'persona_id' | 'created_at' | 'status'> {
  messages: Pick<MessageRow, 'content' | 'created_at'>[] | null
}

export interface ConversationWithMessageCount
  extends Pick<ConversationRow, 'id' | 'persona_id' | 'created_at'> {
  messages: { count: number }[] | null
}

export interface ConversationQueueRow
  extends Pick<ConversationRow, 'id' | 'persona_id' | 'created_at'> {
  status?: string
  assigned_to?: string | null
  users: { name: string } | null
  personas: { name: string } | null
  messages: { count: number }[] | null
}

export interface ConversationPersonaRef {
  persona_id: string
  personas: PersonaRow | null
}
