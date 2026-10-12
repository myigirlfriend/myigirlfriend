export type PlanId = 'free' | 'basic' | 'premium'
export type PaidPlanId = Exclude<PlanId, 'free'>
export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'past_due'

/** How a plan is presented on the landing page, the plans page and the upsell. */
export interface PlanDefinition<Id extends PlanId = PlanId> {
  id: Id
  label: string
  price: string
  /** Billing period shown next to the price, e.g. "/ month" */
  period?: string
  description: string
  /** One line used where there is no room for the feature list */
  summary: string
  features: string[]
  popular: boolean
}

export interface SubscriptionStatusResponse {
  plan: PlanId
  status: SubscriptionStatus
  isPaid: boolean
}

export interface CheckoutResponse {
  url: string | null
}
