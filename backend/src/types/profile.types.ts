export interface RecentConversation {
  id: string
  /** Holds the persona id. Named `personaName` for compatibility with existing clients. */
  personaName: string
  messageCount: number
  date: string
}

export interface ProfileStatsResponse {
  totalConversations: number
  totalMessages: number
  recentConversations: RecentConversation[]
}
