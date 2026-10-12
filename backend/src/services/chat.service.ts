import { conversationRepository, messageRepository, subscriptionRepository } from '../repositories'
import type { AuthTokenPayload, ConversationSummary, MessageRow, SendMessageResponse, StartChatResult } from '../types'
import { notFound, serverError } from '../utils/httpError'
import { logger } from '../utils/logger'
import { aiService } from './ai.service'
import { memoryService } from './memory.service'
import { usageService } from './usage.service'

// Messages loaded as context for a reply
const HISTORY_LIMIT = 30
const PREVIEW_LENGTH = 60
const FALLBACK_REPLY = "Hey, I'm here for you"

export const chatService = {
  /** Start or resume a conversation with a persona. */
  async startChat(userId: string, personaId: string): Promise<StartChatResult> {
    const existingId = await conversationRepository.findActiveId(userId, personaId)
    if (existingId) return { conversationId: existingId, created: false }

    try {
      const conversation = await conversationRepository.create(userId, personaId)
      return { conversationId: conversation.id, created: true }
    } catch (e) {
      logger.error('[chat] Could not start conversation', e)
      throw serverError('Could not start conversation')
    }
  },

  /** Save the member's message and return the AI reply. */
  async sendMessage(userId: string, conversationId: string, content: string): Promise<SendMessageResponse> {
    const conversation = await conversationRepository.findForUserWithPersona(conversationId, userId)
    if (!conversation) throw notFound('Conversation not found')

    const [messageCount, subscription] = await Promise.all([
      usageService.getMessageCount(userId),
      subscriptionRepository.findByUser(userId),
    ])
    const isPaid = subscription?.status === 'active'

    // Hard block on backend — cannot be bypassed from frontend
    if (!isPaid && usageService.hasReachedFreeLimit(messageCount)) {
      return { triggerUpsell: true, message: null, reason: 'free_limit_reached' }
    }

    await messageRepository.create(conversationId, 'user', content)

    const [history, memory] = await Promise.all([
      messageRepository.findLatest(conversationId, HISTORY_LIMIT),
      memoryService.getMemory(userId),
    ])

    // Extract and save memory from user message (non-blocking)
    memoryService.extractAndSave(userId, content).catch((e) => logger.warn('[chat] Memory was not saved', e))

    let replyContent: string
    try {
      replyContent = await aiService.generateReply(conversation.personas ?? conversation.persona_id, memory, history)
    } catch (e) {
      logger.error('[chat] AI reply failed, using the fallback', e)
      replyContent = FALLBACK_REPLY
    }

    const message = await messageRepository.create(conversationId, 'ai', replyContent)

    const newCount = messageCount + 1
    await usageService.setMessageCount(userId, newCount)

    return {
      message,
      triggerUpsell: !isPaid && usageService.hasReachedFreeLimit(newCount),
    }
  },

  /** Message history. Members can only read their own conversations; admins and agents can read any. */
  async getHistory(conversationId: string, requester: AuthTokenPayload): Promise<MessageRow[]> {
    const isOperator = requester.role === 'admin' || requester.role === 'agent'

    if (!isOperator && !(await conversationRepository.belongsToUser(conversationId, requester.id))) {
      throw notFound()
    }

    return messageRepository.findByConversation(conversationId)
  },

  /** A member's active conversations with a preview of the latest message. */
  async listConversations(userId: string): Promise<ConversationSummary[]> {
    const conversations = await conversationRepository.findActiveByUserWithMessages(userId)

    return conversations.map((c) => {
      const latest = [...(c.messages ?? [])].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0]

      return {
        id: c.id,
        personaId: c.persona_id,
        createdAt: c.created_at,
        lastMessage: latest?.content?.slice(0, PREVIEW_LENGTH) || null,
        lastMessageAt: latest?.created_at || c.created_at,
      }
    })
  },
}
