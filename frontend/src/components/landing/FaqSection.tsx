import { Plus } from 'lucide-react'
import { FREE_MESSAGE_LIMIT, FREE_SESSION_MINUTES } from '@config/limits'
import { PAID_PLANS } from '@config/plans'
import SectionHeading from './SectionHeading'

const [basic, premium] = PAID_PLANS
const per = (period?: string) => period?.replace(/^\/\s*/, 'per ') ?? ''

const QUESTIONS = [
  {
    q: 'Is it really free to start?',
    a: `Yes. Your first ${FREE_MESSAGE_LIMIT} messages are free, with up to ${FREE_SESSION_MINUTES} minutes per session. You do not need a card to sign up.`,
  },
  {
    q: 'Who am I talking to?',
    a: 'Companions with their own personalities, powered by AI. Each one has her own style, from playful and flirty to calm and thoughtful.',
  },
  {
    q: 'Does she remember me?',
    a: 'Yes. She keeps what you tell her, like your name and what is going on in your life, so you can pick up where you left off. Premium adds deeper memory.',
  },
  {
    q: 'How do the plans differ?',
    a: `${basic?.label}: unlimited messages with one companion of your choice, ${basic?.price} ${per(basic?.period)}. ${premium?.label}: unlimited messages with every companion and deep memory, ${premium?.price} ${per(premium?.period)}.`,
  },
  {
    q: 'Can I cancel any time?',
    a: 'Yes, from the Plans page in two taps. You keep access until the end of the period you paid for, then you go back to the free plan.',
  },
  {
    q: 'How is payment handled?',
    a: 'Checkout runs on Stripe. Your card details go to Stripe directly and are never stored by us.',
  },
  {
    q: 'Is anything explicit?',
    a: 'No. Every companion can flirt, comfort and joke, and keeps it tasteful.',
  },
]

/** Frequently asked questions as an accordion. The first one starts open. */
export default function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-20 bg-brand-surface py-[clamp(88px,11vw,160px)]">
      <div className="frame grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <SectionHeading title="Questions? Answered." intro="Everything people ask before their first message." />

        <div className="space-y-2">
          {QUESTIONS.map(({ q, a }, i) => (
            <details key={q} open={i === 0} className="group rounded-3xl bg-brand-card">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-3xl px-6 py-5 text-lg font-extrabold text-brand-text [&::-webkit-details-marker]:hidden">
                {q}
                <Plus size={22} strokeWidth={2.5} className="shrink-0 text-brand-pink transition-transform duration-200 group-open:rotate-45" aria-hidden="true" />
              </summary>
              <p className="max-w-[62ch] px-6 pb-6 text-[17px] leading-relaxed text-brand-muted">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
