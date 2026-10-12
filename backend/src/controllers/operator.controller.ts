import type { Request, Response } from 'express'
import { currentOperator } from '../middleware/auth.middleware'
import { operatorService } from '../services'
import type {
  AdminHoursResponse,
  AgentsResponse,
  ChatHistoryEntry,
  ClockInResponse,
  ClockOutResponse,
  HoursResponse,
  OperatorLoginResponse,
  OverviewResponse,
  QueueResponse,
  ReplyResponse,
  SuccessResponse,
  SuggestionsResponse,
} from '../types'
import { badRequest } from '../utils/httpError'
import { ok } from '../utils/response'
import { isRecord, text } from '../utils/validate'

// The dashboard sends the messages it has on screen; keep only well-formed ones
const toHistory = (messages: unknown): ChatHistoryEntry[] =>
  Array.isArray(messages)
    ? messages.flatMap((m): ChatHistoryEntry[] =>
        isRecord(m) && typeof m.content === 'string'
          ? [{ sender: m.sender === 'user' ? 'user' : 'ai', content: m.content }]
          : []
      )
    : []

export const operatorController = {
  async login(req: Request, res: Response) {
    const operator = await operatorService.login(text(req.body.email), text(req.body.password))
    ok<OperatorLoginResponse>(res, { operator })
  },

  async queue(req: Request, res: Response) {
    ok<QueueResponse>(res, { conversations: await operatorService.getQueue(currentOperator(req)) })
  },

  async assign(req: Request, res: Response) {
    const conversationId = text(req.body.conversationId)
    if (!conversationId) throw badRequest('conversationId required')

    await operatorService.assignConversation(conversationId, text(req.body.operatorId) || null)
    ok<SuccessResponse>(res, { success: true })
  },

  async agents(_req: Request, res: Response) {
    ok<AgentsResponse>(res, { agents: await operatorService.listAgents() })
  },

  async suggest(req: Request, res: Response) {
    const suggestions = await operatorService.suggestReplies(text(req.body.conversationId), toHistory(req.body.messages))
    ok<SuggestionsResponse>(res, { suggestions })
  },

  async reply(req: Request, res: Response) {
    const conversationId = text(req.body.conversationId)
    const content = text(req.body.content)
    if (!conversationId || !content) throw badRequest('Missing fields')

    ok<ReplyResponse>(res, { message: await operatorService.reply(conversationId, content) })
  },

  async hours(req: Request, res: Response) {
    ok<HoursResponse>(res, await operatorService.getHours(currentOperator(req).id))
  },

  async clockIn(req: Request, res: Response) {
    ok<ClockInResponse>(res, { session: await operatorService.clockIn(currentOperator(req).id) })
  },

  async clockOut(req: Request, res: Response) {
    ok<ClockOutResponse>(res, await operatorService.clockOut(currentOperator(req).id))
  },

  async adminHours(req: Request, res: Response) {
    const date = typeof req.query.date === 'string' ? req.query.date : undefined
    ok<AdminHoursResponse>(res, await operatorService.getAdminHours(date))
  },

  async overview(_req: Request, res: Response) {
    ok<OverviewResponse>(res, await operatorService.getOverview())
  },
}
