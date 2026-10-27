import { Reveal, RevealItem } from '@components/common/Reveal'
import Bubble from '@components/chat/Bubble'
import { FREE_MESSAGE_LIMIT } from '@config/limits'
import signupImage from '@/assets/landing/step-signup.webp'
import matchImage from '@/assets/landing/step-match.webp'
import chatImage from '@/assets/landing/step-chat.webp'
import SectionHeading from './SectionHeading'

// Sample lines for illustration, shown on the photos like notifications
const STEPS = [
  {
    title: 'Create your free account',
    text: `Sign up with Google or email in under a minute. Your first ${FREE_MESSAGE_LIMIT} messages are on us.`,
    image: signupImage,
    note: { tone: 'sent' as const, text: 'Account created' },
  },
  {
    title: 'Swipe and match',
    text: 'Browse the companions, read their profiles and like the one who catches your eye.',
    image: matchImage,
    note: { tone: 'received' as const, text: 'You matched! Say hi' },
  },
  {
    title: 'Start the conversation',
    text: 'Text her like you would anyone. She flirts back, listens and picks up where you left off.',
    image: chatImage,
    note: { tone: 'received' as const, text: 'Finally, I was hoping you would text' },
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="frame scroll-mt-20 py-[clamp(88px,11vw,160px)]">
      <SectionHeading title="How it works" intro="Three steps from hello to your first real conversation." align="center" />

      <Reveal as="ol" className="mt-14 grid gap-8 md:grid-cols-3 md:gap-5">
        {STEPS.map((step, i) => (
          // The middle step sits lower, so the row reads as a path rather than a grid
          <RevealItem as="li" key={step.title} className={i === 1 ? 'md:mt-16' : ''}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-brand-card">
              <img src={step.image} alt="" width={1024} height={1280} loading="lazy" className="h-full w-full object-cover" />
              <div className="absolute inset-x-4 bottom-4" data-ui>
                <Bubble tone={step.note.tone} side="start">{step.note.text}</Bubble>
              </div>
            </div>
            <h3 className="heading mt-6 text-2xl">{step.title}</h3>
            <p className="mt-2 max-w-[36ch] text-[17px] leading-relaxed text-brand-muted">{step.text}</p>
          </RevealItem>
        ))}
      </Reveal>
    </section>
  )
}
