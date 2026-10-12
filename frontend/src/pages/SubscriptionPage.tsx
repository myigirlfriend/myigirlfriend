import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Button from '@components/common/Button'
import ConfirmDialog from '@components/common/ConfirmDialog'
import MemberPage from '@components/layout/MemberPage'
import PlanCard from '@components/subscription/PlanCard'
import { PAID_PLANS, planLabel } from '@config/plans'
import { useCheckout } from '@hooks/useCheckout'
import { useSubscription } from '@hooks/useSubscription'
import { subscriptionApi } from '@services/api'
import { errorMessage } from '@utils/text'

export default function SubscriptionPage() {
  const { plan, isPaid, setSubStatus } = useSubscription()
  const { checkout, pendingPlan } = useCheckout()
  const [searchParams, setSearchParams] = useSearchParams()
  const [confirmingCancel, setConfirmingCancel] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  // Handle return from Stripe
  useEffect(() => {
    const upgraded = searchParams.get('upgraded') === 'true'
    const cancelled = searchParams.get('cancelled') === 'true'
    if (!upgraded && !cancelled) return

    if (upgraded) toast.success('Welcome aboard! Enjoy unlimited access.')
    if (cancelled) toast.error('Payment cancelled. No charge was made.')
    setSearchParams({}, { replace: true })
  }, [searchParams, setSearchParams])

  const cancelSubscription = async () => {
    setCancelling(true)
    try {
      await subscriptionApi.cancel()
      toast.success('Subscription cancelled. You keep access until your billing period ends.')
      setSubStatus('cancelled')
      setConfirmingCancel(false)
    } catch (err) {
      toast.error(errorMessage(err))
    } finally { setCancelling(false) }
  }

  return (
    <MemberPage
      title={isPaid ? 'Your subscription' : 'Unlock everything'}
      subtitle={isPaid ? `You're on the ${planLabel(plan)} plan.` : 'No limits. Real connection.'}
    >
      <div className="space-y-6 pt-3">
        {PAID_PLANS.map((option) => {
          const isCurrent = isPaid && plan === option.id
          // Premium already covers everything in Basic
          const isIncluded = isPaid && plan === 'premium' && !isCurrent

          return (
            <PlanCard
              key={option.id}
              plan={option}
              current={isCurrent}
              action={isCurrent ? (
                <Button variant="danger" fullWidth onClick={() => setConfirmingCancel(true)}>
                  Cancel subscription
                </Button>
              ) : (
                <Button
                  variant={option.popular ? 'primary' : 'secondary'}
                  fullWidth
                  disabled={isIncluded || (!!pendingPlan && pendingPlan !== option.id)}
                  loading={pendingPlan === option.id}
                  loadingText="Redirecting…"
                  onClick={() => checkout(option.id)}
                >
                  {isIncluded ? 'Included in Premium' : `Get ${option.label}`}
                </Button>
              )}
            />
          )
        })}
      </div>

      <p className="mt-6 text-center text-xs leading-relaxed text-brand-muted">
        Secure payment via Stripe · Cancel anytime · No hidden fees
      </p>

      <ConfirmDialog
        isOpen={confirmingCancel}
        title="Cancel your subscription?"
        message="You keep access until the end of your billing period. After that you go back to the free plan."
        confirmLabel="Cancel subscription"
        cancelLabel="Keep my plan"
        danger
        loading={cancelling}
        onConfirm={cancelSubscription}
        onCancel={() => setConfirmingCancel(false)}
      />
    </MemberPage>
  )
}
