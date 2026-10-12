export type MessageSender = 'user' | 'ai' | 'operator'

export interface Message {
  id: string
  sender: MessageSender
  content: string
  created_at: string
  conversation_id?: string
}

export interface ConversationSummary {
  id: string
  personaId: string
  createdAt: string
  lastMessage: string | null
  lastMessageAt: string
}

export interface StartChatResponse {
  conversationId: string
}

export interface SendMessageResponse {
  /** null when the free limit blocked the message, so there is no reply to show */
  message: Message | null
  triggerUpsell: boolean
  reason?: 'free_limit_reached'
}

export interface HistoryResponse {
  messages: Message[]
}

export interface ConversationsResponse {
  conversations: ConversationSummary[]
}
