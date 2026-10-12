import type { Request, Response } from 'express'
import { currentUser } from '../middleware/auth.middleware'
import { WebhookSignatureError, subscriptionService } from '../services'
import type { CancelSubscriptionResponse, CheckoutResponse, SubscriptionStatusResponse } from '../types'
import { logger } from '../utils/logger'
import { ok } from '../utils/response'

export const subscriptionController = {
  async checkout(req: Request, res: Response) {
    const url = await subscriptionService.createCheckoutUrl(currentUser(req), req.body.plan)
    ok<CheckoutResponse>(res, { url })
  },

  /** Stripe calls this. The body is the raw payload (see express.raw in app.ts) so the signature can be checked. */
  async webhook(req: Request, res: Response) {
    const signature = req.headers['stripe-signature']
    try {
      await subscriptionService.handleWebhook(req.body, typeof signature === 'string' ? signature : '')
    } catch (e) {
      if (!(e instanceof WebhookSignatureError)) throw e
      logger.error('[Webhook error]', e.message)
      return void res.status(400).send(`Webhook Error: ${e.message}`)
    }
    res.json({ received: true })
  },

  async status(req: Request, res: Response) {
    ok<SubscriptionStatusResponse>(res, await subscriptionService.getStatus(currentUser(req).id))
  },

  async cancel(req: Request, res: Response) {
    await subscriptionService.cancel(currentUser(req).id)
    ok<CancelSubscriptionResponse>(res, { message: 'Subscription will cancel at end of billing period' })
  },
}
