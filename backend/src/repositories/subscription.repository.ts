import { supabase } from '../config/supabase'
import type { SubscriptionPlan, SubscriptionRow, SubscriptionStatus } from '../types'
import { done, one, total } from './base'

type SubscriptionSummary = Pick<SubscriptionRow, 'plan' | 'status' | 'stripe_customer_id'>

export const subscriptionRepository = {
  async findByUser(userId: string): Promise<SubscriptionSummary | null> {
    return one<SubscriptionSummary>(
      await supabase
        .from('subscriptions')
        .select('plan, status, stripe_customer_id')
        .eq('user_id', userId)
        .maybeSingle()
    )
  },

  async upsertForUser(subscription: {
    user_id: string
    plan: SubscriptionPlan
    status: SubscriptionStatus
    stripe_customer_id: string | null
  }): Promise<void> {
    done(await supabase.from('subscriptions').upsert(subscription, { onConflict: 'user_id' }))
  },

  async updateByCustomer(
    stripeCustomerId: string,
    changes: Partial<Pick<SubscriptionRow, 'plan' | 'status'>>
  ): Promise<void> {
    done(await supabase.from('subscriptions').update(changes).eq('stripe_customer_id', stripeCustomerId))
  },

  async countActive(): Promise<number> {
    return total(await supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'))
  },
}
