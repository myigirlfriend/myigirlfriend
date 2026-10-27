import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Button from '@components/common/Button'
import ConfirmDialog from '@components/common/ConfirmDialog'
import MemberPage from '@components/layout/MemberPage'
import PlanCard, { planActionVariant } from '@components/subscription/PlanCard'
import { FREE_PLAN, PAID_PLANS, planLabel } from '@config/plans'
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

    if (upgraded) toast.success('You are in. Unlimited messages start now.')
    if (cancelled) toast.error('Checkout was closed before paying. You have not been charged.')
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

  // The plans step up in height, like on the landing page
  const plans = isPaid ? PAID_PLANS : [FREE_PLAN, ...PAID_PLANS]
  const steps = isPaid ? ['lg:min-h-[480px]', 'lg:min-h-[560px]'] : ['lg:min-h-[400px]', 'lg:min-h-[480px]', 'lg:min-h-[560px]']

  return (
    <MemberPage
      wide
      tabTitle="Plans"
      title={isPaid ? 'Your plan' : 'Talk without limits'}
      subtitle={isPaid
        ? `You are on ${planLabel(plan)}. Change or cancel it here.`
        : 'Unlimited messages, and she remembers everything you tell her.'}
    >
      <div className={`grid items-end gap-2 ${isPaid ? 'md:grid-cols-2 lg:max-w-4xl' : 'md:grid-cols-3'}`}>
        {plans.map((option, i) => {
          const isCurrent = option.id === 'free' ? !isPaid : isPaid && plan === option.id
          // Premium already covers everything in Basic
          const isIncluded = isPaid && plan === 'premium' && option.id === 'basic'

          return (
            <PlanCard
              key={option.id}
              plan={option}
              current={isCurrent}
              className={steps[i]}
              action={option.id === 'free' ? undefined : isCurrent ? (
                <Button variant="secondary" fullWidth size="lg" onClick={() => setConfirmingCancel(true)}>
                  Cancel subscription
                </Button>
              ) : (
                <Button
                  variant={planActionVariant(option.id)}
                  fullWidth
                  size="lg"
                  disabled={isIncluded || (!!pendingPlan && pendingPlan !== option.id)}
                  loading={pendingPlan === option.id}
                  loadingText="Opening checkout…"
                  onClick={() => checkout(option.id)}
                >
                  {isIncluded ? 'Included in Premium' : `Choose ${option.label}`}
                </Button>
              )}
            />
          )
        })}
      </div>

      <p className="mt-8 text-base leading-relaxed text-brand-muted">
        Payment is handled by Stripe. Cancel any time and keep access until the end of the period you paid for.
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
