import type { SubscriptionPlan, SubscriptionStatus } from './db.types'

export type PaidPlan = Exclude<SubscriptionPlan, 'free'>

export interface CheckoutResponse {
  url: string | null
}

export interface SubscriptionStatusResponse {
  plan: SubscriptionPlan
  status: SubscriptionStatus
  isPaid: boolean
}

export interface CancelSubscriptionResponse {
  message: string
}
