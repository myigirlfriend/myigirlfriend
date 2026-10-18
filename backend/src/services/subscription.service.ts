import type Stripe from 'stripe'
import { env } from '../config/env'
import { stripe } from '../config/stripe'
import { subscriptionRepository } from '../repositories'
import type { PaidPlan, SubscriptionStatusResponse, UserTokenPayload } from '../types'
import { HttpError, badRequest, errorMessage, serverError } from '../utils/httpError'
import { logger } from '../utils/logger'
import { usageService } from './usage.service'

const PLANS: Record<PaidPlan, { priceId: string | undefined; label: string }> = {
  basic: { priceId: env.stripe.basicPriceId, label: 'Basic' },
  premium: { priceId: env.stripe.premiumPriceId, label: 'Premium' },
}

const isPaidPlan = (plan: unknown): plan is PaidPlan => typeof plan === 'string' && Object.hasOwn(PLANS, plan)

// Stripe sends either the customer id or the expanded customer object
const customerId = (customer: string | { id: string } | null): string | null =>
  typeof customer === 'string' ? customer : (customer?.id ?? null)

/** Thrown when a webhook payload does not carry a valid Stripe signature. */
export class WebhookSignatureError extends Error {}

export const subscriptionService = {
  /** Create a Stripe Checkout session and return the URL to send the member to. */
  async createCheckoutUrl(user: UserTokenPayload, plan: unknown): Promise<string | null> {
    if (!isPaidPlan(plan)) throw badRequest('Invalid plan')
    const { priceId } = PLANS[plan]
    if (!priceId) throw serverError('Price ID not configured')

    try {
      const subscription = await subscriptionRepository.findByUser(user.id)

      const params: Stripe.Checkout.SessionCreateParams = {
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${env.frontendUrl}/subscription?upgraded=true`,
        cancel_url: `${env.frontendUrl}/subscription?cancelled=true`,
        metadata: { userId: user.id, plan },
        allow_promotion_codes: true,
      }

      // Attach existing customer if available
      if (subscription?.stripe_customer_id) {
        params.customer = subscription.stripe_customer_id
      } else {
        params.customer_email = user.email
      }

      const session = await stripe.checkout.sessions.create(params)
      return session.url
    } catch (e) {
      logger.error('[Stripe checkout error]', errorMessage(e))
      throw serverError('Could not create checkout session')
    }
  },

  /** Verify a Stripe webhook and apply the subscription change it describes. */
  async handleWebhook(rawBody: Buffer, signature: string): Promise<void> {
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, env.stripe.webhookSecret)
    } catch (e) {
      throw new WebhookSignatureError(errorMessage(e))
    }

    logger.info('[Stripe webhook]', event.type)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.metadata?.userId
        const plan = session.metadata?.plan
        if (!userId || !isPaidPlan(plan)) {
          logger.warn('[Stripe] Checkout session without a user or plan:', session.id)
          break
        }

        await subscriptionRepository.upsertForUser({
          user_id: userId,
          plan,
          status: 'active',
          stripe_customer_id: customerId(session.customer),
        })

        // Reset usage count so paid user starts fresh
        await usageService.reset(userId)

        logger.info(`[Stripe] User ${userId} subscribed to ${plan}`)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object
        const customer = customerId(subscription.customer)
        if (!customer) break

        await subscriptionRepository.updateByCustomer(customer, {
          status: subscription.status === 'active' ? 'active' : 'inactive',
        })
        break
      }

      case 'customer.subscription.deleted': {
        const customer = customerId(event.data.object.customer)
        if (!customer) break

        await subscriptionRepository.updateByCustomer(customer, { status: 'cancelled', plan: 'free' })
        logger.info(`[Stripe] Subscription cancelled for customer ${customer}`)
        break
      }

      case 'invoice.payment_failed': {
        const customer = customerId(event.data.object.customer)
        if (!customer) break

        await subscriptionRepository.updateByCustomer(customer, { status: 'past_due' })
        break
      }

      default:
        logger.info(`[Stripe] Unhandled event: ${event.type}`)
    }
  },

  async getStatus(userId: string): Promise<SubscriptionStatusResponse> {
    const subscription = await subscriptionRepository.findByUser(userId)
    return {
      plan: subscription?.plan || 'free',
      status: subscription?.status || 'inactive',
      isPaid: subscription?.status === 'active',
    }
  },

  /** Cancel at period end — the member keeps access until the billing period ends. */
  async cancel(userId: string): Promise<void> {
    const subscription = await subscriptionRepository.findByUser(userId)
    if (!subscription?.stripe_customer_id) throw badRequest('No active subscription')

    try {
      const active = await stripe.subscriptions.list({
        customer: subscription.stripe_customer_id,
        status: 'active',
        limit: 1,
      })

      const current = active.data[0]
      if (!current) throw badRequest('No active subscription found')

      await stripe.subscriptions.update(current.id, { cancel_at_period_end: true })
    } catch (e) {
      if (e instanceof HttpError) throw e
      logger.error('[Cancel error]', errorMessage(e))
      throw serverError('Could not cancel subscription')
    }
  },
}
