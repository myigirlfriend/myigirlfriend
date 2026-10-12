import { http } from '@services/http'
import type { CheckoutResponse, PaidPlanId, SubscriptionStatusResponse } from '@/types'

export const subscriptionApi = {
  status: () => http.get<SubscriptionStatusResponse>('/api/subscription/status'),
  checkout: (plan: PaidPlanId) => http.post<CheckoutResponse>('/api/subscription/checkout', { plan }),
  cancel: () => http.post<{ message: string }>('/api/subscription/cancel'),
}
