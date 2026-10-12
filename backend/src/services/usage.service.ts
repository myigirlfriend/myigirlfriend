import { usageRepository } from '../repositories'

/** Messages a member can send before they need a paid plan. Enforced here, on the server. */
export const FREE_MESSAGE_LIMIT = 5

export const usageService = {
  /** Creates the counter row for a new member. */
  async start(userId: string): Promise<void> {
    await usageRepository.create(userId)
  },

  async getMessageCount(userId: string): Promise<number> {
    const usage = await usageRepository.findByUser(userId)
    return usage?.message_count || 0
  },

  hasReachedFreeLimit(messageCount: number): boolean {
    return messageCount >= FREE_MESSAGE_LIMIT
  },

  async setMessageCount(userId: string, messageCount: number): Promise<void> {
    await usageRepository.setMessageCount(userId, messageCount)
  },

  async reset(userId: string): Promise<void> {
    await usageRepository.setMessageCount(userId, 0)
  },
}
