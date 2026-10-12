import { http } from '@services/http'
import type {
  AdminHoursResponse,
  AgentsResponse,
  ClockOutResponse,
  Credentials,
  HoursResponse,
  Message,
  OperatorLoginResponse,
  Overview,
  QueueResponse,
  ReplyResponse,
  SuggestionsResponse,
} from '@/types'

export const operatorApi = {
  login: (credentials: Credentials) => http.post<OperatorLoginResponse>('/api/operator/login', credentials),

  queue: () => http.get<QueueResponse>('/api/operator/queue'),
  agents: () => http.get<AgentsResponse>('/api/operator/agents'),
  assign: (conversationId: string, operatorId: string | null) =>
    http.post<{ success: true }>('/api/operator/assign', { conversationId, operatorId }),
  suggest: (conversationId: string, messages: Message[]) =>
    http.post<SuggestionsResponse>('/api/operator/suggest', { conversationId, messages }),
  reply: (conversationId: string, content: string) =>
    http.post<ReplyResponse>('/api/operator/reply', { conversationId, content }),

  hours: () => http.get<HoursResponse>('/api/operator/hours'),
  clockIn: () => http.post<unknown>('/api/operator/hours/clockin'),
  clockOut: () => http.post<ClockOutResponse>('/api/operator/hours/clockout'),

  /** Admin only. `date` is YYYY-MM-DD. */
  adminHours: (date: string) => http.get<AdminHoursResponse>('/api/operator/admin/hours', { params: { date } }),
  /** Admin only. */
  overview: () => http.get<Overview>('/api/operator/admin/overview'),
}
