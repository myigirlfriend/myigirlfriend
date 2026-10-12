export interface RecentConversation {
  id: string
  /** Holds the persona id (the API names this field `personaName`) */
  personaName: string
  messageCount: number
  date: string
}

export interface ProfileStats {
  totalConversations: number
  totalMessages: number
  recentConversations: RecentConversation[]
}
