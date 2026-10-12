import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { subscriptionApi } from '@services/api'
import { errorMessage } from '@utils/text'
import type { PaidPlanId } from '@/types'

/** Sends the member to Stripe Checkout. `pendingPlan` is the plan being opened, for loading states. */
export function useCheckout() {
  const [pendingPlan, setPendingPlan] = useState<PaidPlanId | null>(null)

  const checkout = useCallback(async (plan: PaidPlanId) => {
    setPendingPlan(plan)
    try {
      const { url } = await subscriptionApi.checkout(plan)
      if (!url) throw new Error('Checkout is not available right now. Try again.')
      window.location.href = url
    } catch (err) {
      toast.error(errorMessage(err, 'Something went wrong. Try again.'))
      setPendingPlan(null)
    }
  }, [])

  return { checkout, pendingPlan }
}
