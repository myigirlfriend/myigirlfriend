import type { Request, Response } from 'express'
import { currentUser } from '../middleware/auth.middleware'
import { chatService } from '../services'
import type { ConversationsResponse, HistoryResponse, SendMessageResponse, StartChatResponse } from '../types'
import { badRequest } from '../utils/httpError'
import { ok } from '../utils/response'
import { text } from '../utils/validate'

export const chatController = {
  async start(req: Request, res: Response) {
    const personaId = text(req.body.personaId)
    if (!personaId) throw badRequest('personaId required')

    const { conversationId, created } = await chatService.startChat(currentUser(req).id, personaId)
    ok<StartChatResponse>(res, { conversationId }, created ? 201 : 200)
  },

  async send(req: Request, res: Response) {
    const conversationId = text(req.body.conversationId)
    const content = text(req.body.content)
    if (!conversationId || !content) throw badRequest('conversationId and content required')

    ok<SendMessageResponse>(res, await chatService.sendMessage(currentUser(req).id, conversationId, content))
  },

  async history(req: Request, res: Response) {
    const messages = await chatService.getHistory(req.params.conversationId ?? '', currentUser(req))
    ok<HistoryResponse>(res, { messages })
  },

  async conversations(req: Request, res: Response) {
    const conversations = await chatService.listConversations(currentUser(req).id)
    ok<ConversationsResponse>(res, { conversations })
  },
}
