import { Crown } from 'lucide-react'
import Badge from '@components/common/Badge'
import IconTile from '@components/common/IconTile'
import Modal from '@components/common/Modal'
import Spinner from '@components/common/Spinner'
import { PAID_PLANS } from '@config/plans'
import { useCheckout } from '@hooks/useCheckout'
import { useSubStore } from '@store/index'

/** Offers the paid plans once the free limit is reached. */
export default function UpsellModal() {
  const { showUpsell, setShowUpsell } = useSubStore()
  const { checkout, pendingPlan } = useCheckout()
  const close = () => setShowUpsell(false)

  return (
    <Modal isOpen={showUpsell} onClose={close} label="Upgrade your plan" size="sm" position="sheet">
      <IconTile icon={Crown} className="mx-auto mb-4" />
      <h2 className="mb-1 text-center text-lg font-extrabold text-white">She wants to keep talking…</h2>
      <p className="mb-6 text-center text-sm text-brand-muted">
        You've reached the free limit. Unlock unlimited conversations.
      </p>

      <div className="mb-4 space-y-3">
        {PAID_PLANS.map((plan) => (
          <button
            key={plan.id}
            type="button"
            onClick={() => checkout(plan.id)}
            disabled={!!pendingPlan}
            className={`surface flex w-full items-center justify-between gap-3 p-4 text-left transition-colors hover:border-brand-purple/60 disabled:opacity-60 ${
              plan.popular ? 'surface--accent' : ''
            }`}
          >
            <span className="min-w-0">
              <span className="flex items-center gap-2 text-sm font-bold text-white">
                {plan.label}
                {plan.popular && <Badge variant="gradient">Popular</Badge>}
              </span>
              <span className="mt-0.5 block text-xs text-brand-muted">{plan.summary}</span>
            </span>
            <span className="shrink-0 text-right">
              <span className="block font-extrabold text-white">{plan.price}</span>
              <span className="block text-xs text-brand-muted">{plan.period}</span>
            </span>
          </button>
        ))}
      </div>

      {pendingPlan && (
        <div className="mb-3 flex items-center justify-center gap-2 text-sm text-brand-muted" role="status">
          <Spinner size="sm" />
          Redirecting to checkout…
        </div>
      )}

      <button
        type="button"
        onClick={close}
        className="w-full rounded-lg py-2 text-sm text-brand-muted transition-colors hover:text-white"
      >
        Maybe later
      </button>
    </Modal>
  )
}
