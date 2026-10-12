import { FREE_MESSAGE_LIMIT } from '@config/limits'
import type { PaidPlanId, PlanDefinition, PlanId } from '@/types'

// The single place plans, prices and feature lists are written down.
// The amounts charged come from the Stripe prices configured on the server.

export const FREE_PLAN: PlanDefinition<'free'> = {
  id: 'free',
  label: 'Free',
  price: '$0',
  description: 'Try it out',
  summary: `First ${FREE_MESSAGE_LIMIT} messages free`,
  features: [`First ${FREE_MESSAGE_LIMIT} messages free`, '1 companion', 'No credit card needed'],
  popular: false,
}

export const PAID_PLANS: PlanDefinition<PaidPlanId>[] = [
  {
    id: 'basic',
    label: 'Basic',
    price: '$9.99',
    period: '/ 7 days',
    description: 'Perfect for getting started',
    summary: 'Unlimited messages · 1 companion',
    features: ['Unlimited messages', '1 companion of your choice', 'She remembers you', 'Standard support'],
    popular: false,
  },
  {
    id: 'premium',
    label: 'Premium',
    price: '$19.99',
    period: '/ month',
    description: 'The full experience',
    summary: 'All companions · Deep memory',
    features: [
      'Unlimited messages',
      'All companions',
      'Deep memory system',
      'Priority support',
      'Early access to new features',
    ],
    popular: true,
  },
]

const LABELS: Record<PlanId, string> = { free: 'Free', basic: 'Basic', premium: 'Premium' }

export const planLabel = (plan: PlanId): string => LABELS[plan] ?? 'Free'
