import ButtonLink from '@components/common/ButtonLink'
import { Reveal, RevealItem } from '@components/common/Reveal'
import PlanCard, { planActionVariant } from '@components/subscription/PlanCard'
import { FREE_PLAN, PAID_PLANS } from '@config/plans'
import SectionHeading from './SectionHeading'

const PLANS = [FREE_PLAN, ...PAID_PLANS]

export default function PricingSection() {
  return (
    <section id="pricing" className="frame scroll-mt-20 py-[clamp(88px,11vw,160px)]">
      <SectionHeading
        title="Start free. Upgrade when you're hooked."
        intro="Try it without a card. When you want more, unlimited messages start at the price of a coffee."
        align="center"
      />

      <Reveal className="mx-auto mt-14 grid max-w-6xl items-stretch gap-3 md:grid-cols-3">
        {PLANS.map((plan) => (
          <RevealItem key={plan.id} className="flex">
            <PlanCard
              plan={plan}
              className="w-full"
              action={
                <ButtonLink to="/register" variant={planActionVariant(plan.id)} fullWidth size="lg">
                  {plan.id === 'free' ? 'Start free' : `Get ${plan.label}`}
                </ButtonLink>
              }
            />
          </RevealItem>
        ))}
      </Reveal>

      <p className="mt-8 text-center text-base text-brand-muted">
        Secure payment with Stripe. Cancel any time from your account.
      </p>
    </section>
  )
}
