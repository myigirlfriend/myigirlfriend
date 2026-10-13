import { http } from '@services/http'
import { localDayBounds } from '@utils/formatTime'
import type {
  AdminHoursResponse,
  AgentResponse,
  AgentsResponse,
  ClockInResponse,
  ClockOutResponse,
  Credentials,
  HoursResponse,
  NewAgent,
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
  /** Admin only. */
  createAgent: (agent: NewAgent) => http.post<AgentResponse>('/api/operator/agents', agent),
  /** Admin only. */
  resetAgentPassword: (id: string, password: string) =>
    http.post<{ success: true }>(`/api/operator/agents/${id}/password`, { password }),
  /** Admin only. */
  deleteAgent: (id: string) => http.delete<{ success: true }>(`/api/operator/agents/${id}`),
  assign: (conversationId: string, operatorId: string | null) =>
    http.post<{ success: true }>('/api/operator/assign', { conversationId, operatorId }),
  suggest: (conversationId: string, messages: Message[]) =>
    http.post<SuggestionsResponse>('/api/operator/suggest', { conversationId, messages }),
  reply: (conversationId: string, content: string) =>
    http.post<ReplyResponse>('/api/operator/reply', { conversationId, content }),

  // `since` is the start of the agent's own day, so "today" follows their time zone, not the server's
  hours: (since: Date) => http.get<HoursResponse>('/api/operator/hours', { params: { since: since.toISOString() } }),
  clockIn: () => http.post<ClockInResponse>('/api/operator/hours/clockin'),
  clockOut: (since: Date) => http.post<ClockOutResponse>('/api/operator/hours/clockout', { since: since.toISOString() }),

  /** Admin only. `date` is YYYY-MM-DD, read as a day in the admin's own time zone. */
  adminHours: (date: string) => {
    const { from, to } = localDayBounds(date)
    return http.get<AdminHoursResponse>('/api/operator/admin/hours', {
      params: { date, from: from.toISOString(), to: to.toISOString() },
    })
  },
  /** Admin only. */
  overview: () => http.get<Overview>('/api/operator/admin/overview'),
}
