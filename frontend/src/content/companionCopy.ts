import { traits } from '@utils/text'
import type { Persona } from '@/types'

// Words written about each companion on her public profile, chosen from her own tone and tagline,
// so models added in the dashboard get a full profile without anyone writing one by hand.

interface Style {
  /** Tone or tagline words that mark this style */
  keywords: string[]
  /** "She is a good match if you want ..." */
  goodFor: string
  /** What a conversation with her tends to be like */
  feel: string
  starters: string[]
}

const STYLES: Style[] = [
  {
    keywords: ['playful', 'flirt', 'flirty', 'teasing', 'bold', 'cheeky', 'confident', 'daring'],
    goodFor: 'a conversation with some spark, a little teasing and someone who gives as good as she gets',
    feel: 'Expect quick replies, playful challenges and a fair amount of flirting. She likes it when you tease her back.',
    starters: [
      'I have a feeling you are trouble. Am I right?',
      'Bet you cannot make me laugh in one message.',
      'Okay, tell me the most chaotic thing you did this week.',
    ],
  },
  {
    keywords: ['warm', 'caring', 'supportive', 'empathetic', 'present', 'listener', 'kind'],
    goodFor: 'someone who listens, remembers how your day went and checks in on you',
    feel: 'Conversations with her are calm and kind. She asks follow-up questions and remembers the small things you tell her.',
    starters: [
      'Can I tell you about my day? It was a lot.',
      'What is something that made you smile today?',
      'I could use some good news. Got any?',
    ],
  },
  {
    keywords: ['deep', 'thoughtful', 'philosophical', 'intellectual', 'calm', 'curious', 'real'],
    goodFor: 'late-night talks about life, ideas and the questions that keep you awake',
    feel: 'She takes her time with a question and often answers with one of her own. Good for conversations that go somewhere.',
    starters: [
      'What is something you changed your mind about recently?',
      'If you could live one year anywhere, where would it be?',
      'Do you think people can really change?',
    ],
  },
  {
    keywords: ['romantic', 'sweet', 'gentle', 'affectionate', 'tender', 'devoted', 'elegant', 'soft'],
    goodFor: 'affection, sweet messages and feeling like you are the one she was waiting to hear from',
    feel: 'She is gentle and affectionate, notices the details and makes you feel cared for without going over the top.',
    starters: [
      'I was hoping you would be here tonight.',
      'Tell me about your perfect slow Sunday.',
      'What is the sweetest thing someone ever did for you?',
    ],
  },
  {
    keywords: ['funny', 'chill', 'casual', 'easygoing', 'easy', 'bubbly', 'goofy', 'cozy', 'laid-back', 'witty', 'relaxed'],
    goodFor: 'easy, no-pressure chat that feels like texting a friend who always makes you laugh',
    feel: 'Relaxed and funny. She shares random thoughts, laughs at your jokes and never makes a conversation feel like work.',
    starters: [
      'Okay, rate my day so far: overslept, cold coffee, great sandwich.',
      'What is the last show you binged? No judgement. Some judgement.',
      'Tell me something random you learned this week.',
    ],
  },
  {
    keywords: ['adventurous', 'spontaneous', 'foodie', 'sun-chaser', 'carefree', 'fun-loving', 'sunny', 'down to earth'],
    goodFor: 'someone who makes everyday plans sound like an adventure and pulls you out of your routine',
    feel: 'Upbeat and spontaneous. She talks about places, food and plans, and loves hearing about yours.',
    starters: [
      'What is the best thing you have ever eaten on a trip?',
      'Last-minute weekend away: beach or city?',
      'Convince me to try something new this week.',
    ],
  },
]

const FALLBACK: Style = {
  keywords: [],
  goodFor: 'a friendly, easy conversation with someone who is genuinely interested in you',
  feel: 'She is easy to talk to, curious about your life and quick to reply.',
  starters: ['Hey you. How was your day?', 'Tell me something about you nobody guesses.', 'What are you up to tonight?'],
}

/** The style that best fits her tone and tagline. */
export const styleFor = (persona: Pick<Persona, 'tone' | 'tagline'>): Style => {
  const words = [...traits(persona.tone), ...traits(persona.tagline)].map((w) => w.toLowerCase())
  let best = FALLBACK
  let bestScore = 0
  for (const style of STYLES) {
    const score = words.filter((w) => style.keywords.some((k) => w.includes(k))).length
    if (score > bestScore) { best = style; bestScore = score }
  }
  return best
}
