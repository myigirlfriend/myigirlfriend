import { Reveal, RevealItem } from '@components/common/Reveal'
import { FREE_MESSAGE_LIMIT } from '@config/limits'

const FACTS = [
  { title: `${FREE_MESSAGE_LIMIT} messages free`, text: 'No card needed to start' },
  { title: 'Replies in seconds', text: 'Day or night, she is online' },
  { title: 'She remembers you', text: 'Your name, your day, your story' },
  { title: 'Cancel anytime', text: 'Secure checkout with Stripe' },
]

/** The four answers to "what's the catch?", set large in one row straight under the hero. */
export default function FactStrip() {
  return (
    <section aria-label="Why members join" className="frame pt-6">
      <Reveal as="ul" className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
        {FACTS.map(({ title, text }) => (
          <RevealItem as="li" key={title}>
            <span className="heading block text-[clamp(22px,2.2vw,30px)] text-brand-pink">{title}</span>
            <span className="mt-1.5 block text-base text-brand-muted">{text}</span>
          </RevealItem>
        ))}
      </Reveal>
    </section>
  )
}
