import { ArrowRight } from 'lucide-react'
import Avatar from '@components/common/Avatar'
import Modal from '@components/common/Modal'
import Spinner from '@components/common/Spinner'
import { PAID_PLANS } from '@config/plans'
import { useCheckout } from '@hooks/useCheckout'
import { usePersonaStore, useSubStore } from '@store/index'

/** Offers the paid plans once the free limit is reached. */
export default function UpsellModal() {
  const { showUpsell, setShowUpsell } = useSubStore()
  const persona = usePersonaStore((s) => s.activePersona)
  const { checkout, pendingPlan } = useCheckout()
  const close = () => setShowUpsell(false)

  return (
    <Modal isOpen={showUpsell} onClose={close} label="Keep talking" size="sm" position="sheet">
      {persona && <Avatar persona={persona} size="xl" className="mb-5" />}
      <h2 className="heading text-3xl">{persona ? `${persona.name} wants to keep talking` : 'Keep the conversation going'}</h2>
      <p className="mt-3 text-base leading-relaxed text-brand-muted">
        Your free chat has run out. Choose a plan to carry on right where you left off.
      </p>

      <div className="mt-6 space-y-2">
        {PAID_PLANS.map((plan) => (
          <button
            key={plan.id}
            type="button"
            onClick={() => checkout(plan.id)}
            disabled={!!pendingPlan}
            className={`group flex w-full items-center gap-4 rounded-3xl p-4 text-left transition-[transform,background-color] duration-150 active:scale-[0.99] disabled:opacity-60 ${
              plan.popular ? 'bg-brand-plum-3 text-white ring-2 ring-inset ring-brand-pink' : 'bg-brand-plum text-white'
            }`}
          >
            <span className="min-w-0 flex-1">
              <span className="block text-lg font-black">{plan.label}</span>
              <span className="mt-0.5 block text-[15px] font-semibold opacity-80">{plan.summary}</span>
            </span>
            <span className="shrink-0 text-right">
              <span className="block text-xl font-black tabular-nums">{plan.price}</span>
              <span className="block text-sm font-semibold opacity-80">{plan.period?.replace(/^\/\s*/, 'per ')}</span>
            </span>
            {pendingPlan === plan.id
              ? <Spinner size="sm" tone="onColor" />
              : <ArrowRight size={20} strokeWidth={2.5} className="shrink-0 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />}
          </button>
        ))}
      </div>

      {pendingPlan && <p className="mt-3 text-sm text-brand-muted" role="status">Opening secure checkout…</p>}

      <button type="button" onClick={close} className="link link--muted mt-5 w-full py-2 text-center text-base">
        Not now
      </button>
    </Modal>
  )
}
