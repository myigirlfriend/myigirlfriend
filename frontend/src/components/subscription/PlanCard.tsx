import type { ReactNode } from 'react'
import { Check } from 'lucide-react'
import type { ButtonVariant } from '@components/common/Button'
import type { PlanDefinition, PlanId } from '@/types'

interface PlanCardProps {
  plan: PlanDefinition
  /** Marks the plan the member is on */
  current?: boolean
  /** The call to action, a full-width Button or ButtonLink using `planActionVariant(plan.id)` */
  action?: ReactNode
  /** Extra classes, e.g. a minimum height so the plans step up in size */
  className?: string
}

interface PlanTone {
  tile: string
  strip: string
  muted: string
}

// Each plan is its own flat field; the bigger the plan, the louder the colour
const TONES: Record<PlanId, PlanTone> = {
  free: { tile: 'bg-brand-surface text-brand-text', strip: 'bg-brand-card', muted: 'text-brand-muted' },
  basic: { tile: 'bg-brand-plum text-white', strip: 'bg-brand-plum-2', muted: 'text-white/75' },
  premium: { tile: 'bg-brand-plum-3 text-white ring-2 ring-inset ring-brand-pink', strip: 'bg-brand-plum-2', muted: 'text-white/80' },
}

const ACTIONS: Record<PlanId, ButtonVariant> = { free: 'secondary', basic: 'secondary', premium: 'primary' }

/** The button style that reads on a plan's own colour. */
export const planActionVariant = (plan: PlanId): ButtonVariant => ACTIONS[plan]

/** One plan with its price and what it includes. Used on the landing page, the plans page and the upsell. */
export default function PlanCard({ plan, current = false, action, className = '' }: PlanCardProps) {
  const tone = TONES[plan.id]

  return (
    <article className={`flex flex-col overflow-hidden rounded-3xl ${tone.tile} ${className}`} aria-current={current || undefined}>
      <div className="flex-1 p-6 sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-2xl font-black tracking-tight sm:text-[28px]">{plan.label}</h3>
          {current ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-black/25 px-3 py-1 text-sm font-extrabold">
              <Check size={14} strokeWidth={3} aria-hidden="true" /> Your plan
            </span>
          ) : plan.popular && (
            <span className="rounded-full bg-brand-rose px-3 py-1 text-sm font-extrabold text-white">Best value</span>
          )}
        </div>
        <p className={`mt-1 text-base ${tone.muted}`}>{plan.description}</p>

        <p className="mt-6 flex items-baseline gap-2">
          <span className="display text-[44px] tabular-nums sm:text-[56px]">{plan.price}</span>
          {plan.period && <span className={`text-base font-bold ${tone.muted}`}>{plan.period.replace(/^\/\s*/, 'per ')}</span>}
        </p>

        <ul className="mt-6 space-y-2.5">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-[17px] leading-snug">
              <Check size={18} strokeWidth={3} className="mt-0.5 shrink-0" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {action && <div className={`p-3 ${tone.strip}`}>{action}</div>}
    </article>
  )
}
