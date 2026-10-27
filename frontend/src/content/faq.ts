import { FREE_MESSAGE_LIMIT, FREE_SESSION_MINUTES } from '@config/limits'
import { PAID_PLANS } from '@config/plans'

const [basic, premium] = PAID_PLANS
const per = (period?: string) => period?.replace(/^\/\s*/, 'per ') ?? ''

export interface Question {
  q: string
  a: string
}

/** The questions people ask before their first message. Shown on the landing page and published as FAQ structured data. */
export const FAQ: Question[] = [
  {
    q: 'What is myigirlfriend?',
    a: 'myigirlfriend is an AI girlfriend chat app. You swipe through companions with their own personalities, match with the one you like and chat with her whenever you want, from any phone or computer.',
  },
  {
    q: 'Is it really free to start?',
    a: `Yes. Your first ${FREE_MESSAGE_LIMIT} messages are free, with up to ${FREE_SESSION_MINUTES} minutes per session. You do not need a card to sign up.`,
  },
  {
    q: 'Who am I talking to?',
    a: 'Companions with their own personalities, powered by AI. Each one has her own style, from playful and flirty to calm and thoughtful. As our Terms explain, some conversations may also be handled by members of our team.',
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
    a: 'No. Every companion can flirt, comfort and joke, and keeps it tasteful. The service is for adults 18 and over.',
  },
]
