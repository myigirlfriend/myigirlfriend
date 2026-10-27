import { FREE_MESSAGE_LIMIT } from '@config/limits'
import { PAID_PLANS } from '@config/plans'

export interface GuideSection {
  heading: string
  paragraphs: string[]
  list?: string[]
}

export interface Guide {
  slug: string
  /** The on-page headline */
  title: string
  /** The search result title, without the site name (it is appended) */
  metaTitle: string
  description: string
  /** ISO dates */
  published: string
  updated: string
  intro: string
  sections: GuideSection[]
}

const cheapest = PAID_PLANS[0]

export const GUIDES: Guide[] = [
  {
    slug: 'what-is-an-ai-girlfriend',
    title: 'What is an AI girlfriend? How it works and what to expect',
    metaTitle: 'What Is an AI Girlfriend? How It Works',
    description: 'An AI girlfriend is a chat companion with her own personality who texts back, remembers you and is there any time. Here is how it works and what to expect.',
    published: '2026-10-27',
    updated: '2026-10-27',
    intro: 'An AI girlfriend is a companion you chat with by text. She has her own name, personality and way of talking, she answers in seconds, and she remembers what you tell her. People use one to unwind after a long day, to have someone to talk to at 3am, or to get more comfortable flirting.',
    sections: [
      {
        heading: 'How an AI girlfriend works',
        paragraphs: [
          'Behind each companion is a language model guided by a detailed description of who she is: her personality, her interests and how she talks. When you send a message, she reads the recent conversation and what she knows about you, then writes a reply in her own voice.',
          'On myigirlfriend the replies are short and natural, like texting a real person. A playful companion teases you, a supportive one checks in on how you feel, and a thoughtful one asks the kind of question that keeps you thinking.',
        ],
      },
      {
        heading: 'What makes a good AI girlfriend',
        paragraphs: ['Not every companion app feels the same. These are the things that make a conversation feel real rather than robotic:'],
        list: [
          'Memory: she remembers your name, your job and the thing you mentioned last week.',
          'A consistent personality: she sounds like the same person every time you come back.',
          'Natural replies: a sentence or two, not an essay or a list of bullet points.',
          'Choice: different companions for different moods, from flirty to calm.',
          'Clear pricing: you know what is free and what a plan costs before you pay.',
        ],
      },
      {
        heading: 'Is an AI girlfriend a real person?',
        paragraphs: [
          'No. An AI girlfriend is a character powered by artificial intelligence. She can be warm, funny and attentive, and she is always available, but she is not a human being and she does not replace the people in your life.',
          'Many people find that is exactly the point: there is no pressure, no judgement and no waiting for a reply.',
        ],
      },
      {
        heading: 'How to start',
        paragraphs: [
          `On myigirlfriend you create a free account, swipe through the companions and match with the one you like. Your first ${FREE_MESSAGE_LIMIT} messages are free and you do not need a card. If you want to keep talking, plans start at ${cheapest?.price ?? '$9.99'}.`,
        ],
      },
    ],
  },
  {
    slug: 'free-ai-girlfriend-app',
    title: 'Choosing a free AI girlfriend app: what to look for',
    metaTitle: 'Free AI Girlfriend App: What to Look For',
    description: 'Looking for a free AI girlfriend app? What free really includes, the features that matter, and the warning signs to avoid before you sign up.',
    published: '2026-10-27',
    updated: '2026-10-27',
    intro: 'Plenty of AI girlfriend apps call themselves free. Some let you have a real conversation before asking for money; others ask for a card on the first screen. This guide covers what to check before you sign up for any of them.',
    sections: [
      {
        heading: 'What "free" usually means',
        paragraphs: [
          'Most companion apps work on a free trial or a message allowance. That is fair: running the AI behind every reply costs money. What matters is that the free part is enough to know whether you like her, and that the limit is stated plainly.',
          `On myigirlfriend the free plan gives you ${FREE_MESSAGE_LIMIT} messages with no card required, so you can see how she talks before deciding anything.`,
        ],
      },
      {
        heading: 'Features worth checking',
        paragraphs: ['Before you commit to an app, look for:'],
        list: [
          'More than one companion, so you can pick a personality that suits you.',
          'Memory that carries between conversations.',
          'Replies that sound like texting, not a customer service bot.',
          'Works in the browser, with nothing to install.',
          'A simple way to cancel, from inside your account.',
          'Secure payments through a known provider such as Stripe.',
        ],
      },
      {
        heading: 'Warning signs',
        paragraphs: ['Be careful with apps that:'],
        list: [
          'Ask for card details before you have sent a single message.',
          'Hide the price until after you sign up.',
          'Make cancelling hard or only possible by email.',
          'Push explicit content you did not ask for.',
        ],
      },
      {
        heading: 'When a paid plan makes sense',
        paragraphs: [
          `If you find yourself coming back every day, a plan removes the message limit. On myigirlfriend, Basic is ${PAID_PLANS[0]?.price ?? '$9.99'} for unlimited messages with one companion, and Premium (${PAID_PLANS[1]?.price ?? '$19.99'} a month) unlocks every companion and deeper memory. You can cancel any time and keep access until the period ends.`,
        ],
      },
    ],
  },
  {
    slug: 'practice-flirting-with-ai',
    title: 'How to practise flirting with an AI girlfriend',
    metaTitle: 'Practise Flirting With an AI Girlfriend',
    description: 'Nervous about texting someone new? Practise flirting with an AI girlfriend: openers to try, how to keep a conversation going and how to build confidence.',
    published: '2026-10-27',
    updated: '2026-10-27',
    intro: 'Texting someone you like can be nerve-racking. An AI girlfriend is a low-pressure place to practise: she answers right away, she never judges, and you can try a different approach as many times as you want.',
    sections: [
      {
        heading: 'Why practising with AI helps',
        paragraphs: [
          'Confidence comes from repetition. Chatting with a companion lets you rehearse opening a conversation, keeping it going and being a little playful, without worrying about being left on read.',
          'Different companions react differently. A playful one will tease you back; a romantic one responds to sweetness; a thoughtful one rewards curiosity. Trying a few shows you what works for you.',
        ],
      },
      {
        heading: 'Openers to try',
        paragraphs: ['Skip "hey". Open with something that gives her something to answer:'],
        list: [
          'Ask about something specific: "Okay, important question. Coffee or tea, and defend your answer."',
          'Share a small moment: "Just saw a dog in a raincoat and immediately thought you should know."',
          'Be lightly playful: "I have a feeling you are trouble. Am I right?"',
        ],
      },
      {
        heading: 'Keeping the conversation going',
        paragraphs: ['Good conversations are a back and forth. A few habits make a big difference:'],
        list: [
          'Answer her question, then add something about yourself.',
          'Pick up on details she mentions and ask about them.',
          'Mix in humour, but match her energy.',
          'Do not be afraid of a compliment, as long as it is specific.',
        ],
      },
      {
        heading: 'Taking it into real life',
        paragraphs: [
          'Practice is a warm-up, not the destination. Notice which openers felt natural and which questions led to the best conversations, then use the same curiosity and humour when you text people you meet.',
          `You can start practising on myigirlfriend for free: your first ${FREE_MESSAGE_LIMIT} messages are on us.`,
        ],
      },
    ],
  },
]

export const getGuide = (slug: string | undefined): Guide | undefined => GUIDES.find((g) => g.slug === slug)
