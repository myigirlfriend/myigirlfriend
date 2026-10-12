import type { ReactNode } from 'react'
import { Check } from 'lucide-react'
import Badge from '@components/common/Badge'
import type { PlanDefinition } from '@/types'

interface PlanCardProps {
  plan: PlanDefinition
  /** Marks the plan the member is on */
  current?: boolean
  /** The call to action, usually a Button */
  action: ReactNode
}

/** One plan with its price and features. Used on the landing page and the plans page. */
export default function PlanCard({ plan, current = false, action }: PlanCardProps) {
  return (
    <div className={`surface relative p-5 ${plan.popular ? 'surface--accent' : ''} ${current ? 'border-brand-purple/60' : ''}`}>
      {(current || plan.popular) && (
        <div className="absolute -top-3 left-5">
          {current
            ? <Badge variant="success" className="bg-brand-dark"><Check size={12} aria-hidden="true" /> Current plan</Badge>
            : <Badge variant="gradient">Most popular</Badge>}
        </div>
      )}

      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className={`text-xl font-extrabold ${plan.popular ? 'gradient-text' : 'text-white'}`}>{plan.label}</h3>
          <p className="mt-0.5 text-xs text-brand-muted">{plan.description}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-extrabold text-white">{plan.price}</div>
          {plan.period && <div className="text-xs text-brand-muted">{plan.period}</div>}
        </div>
      </div>

      <ul className="mb-5 space-y-2">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-sm text-brand-muted">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white">
              <Check size={10} aria-hidden="true" />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      {action}
    </div>
  )
}
