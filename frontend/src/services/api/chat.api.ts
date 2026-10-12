import { http } from '@services/http'
import type { ConversationsResponse, HistoryResponse, SendMessageResponse, StartChatResponse } from '@/types'

export const chatApi = {
  /** Starts a conversation with a persona, or resumes the one already open. */
  start: (personaId: string) => http.post<StartChatResponse>('/api/chat/start', { personaId }),
  send: (conversationId: string, content: string) =>
    http.post<SendMessageResponse>('/api/chat/send', { conversationId, content }),
  history: (conversationId: string) => http.get<HistoryResponse>(`/api/chat/history/${conversationId}`),
  conversations: () => http.get<ConversationsResponse>('/api/chat/conversations'),
}
