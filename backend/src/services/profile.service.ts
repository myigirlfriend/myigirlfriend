import { conversationRepository } from '../repositories'
import type { ProfileStatsResponse } from '../types'

const RECENT_CONVERSATIONS = 5

export const profileService = {
  async getStats(userId: string): Promise<ProfileStatsResponse> {
    const conversations = await conversationRepository.findRecentByUser(userId, RECENT_CONVERSATIONS)

    const recentConversations = conversations.map((c) => ({
      id: c.id,
      personaName: c.persona_id,
      messageCount: c.messages?.[0]?.count || 0,
      date: new Date(c.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    }))

    return {
      totalConversations: conversations.length,
      totalMessages: recentConversations.reduce((sum, c) => sum + c.messageCount, 0),
      recentConversations,
    }
  },
}
