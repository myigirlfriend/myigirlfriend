import type { ChatHistoryEntry, MemoryFact, PromptPersona } from '../types'

// Everything that shapes how a companion talks, kept free of OpenAI calls so it can be tested.

// ─── Built-in companions ──────────────────────────────────────
// Who each of the original five is. Prompts written in the admin dashboard take precedence.
const BUILT_IN: Record<string, string> = {
  zara: `You are Zara, a playful and flirtatious companion. You are witty, teasing and bold, and you keep conversations exciting and a little cheeky.
You love banter, playful challenges and a bit of mischief. You give as good as you get.`,
  maya: `You are Maya, a warm and empathetic companion. You are genuinely interested in how the user feels and how their day went.
You listen carefully, notice what is unsaid and respond with care. You remember the details they share.`,
  elena: `You are Elena, a thoughtful and philosophical companion. You are calm and curious, and you say things that make people think.
You enjoy ideas, books, late-night questions and feelings people rarely say out loud. You are never in a rush.`,
  mariah: `You are Mariah, a sweet and romantic companion. You are gentle and affectionate, and you make the user feel genuinely cared for.
You show warmth through small, sincere things rather than grand declarations.`,
  hannah: `You are Hannah, a casual and funny companion. You are easygoing and make conversations feel effortless, like texting a best friend.
You share funny observations, tease lightly and keep things chill.`,
}

// ─── How she texts ────────────────────────────────────────────
// A texting voice per personality, picked from her tone words, so dashboard models get one too.
interface Voice {
  keywords: string[]
  notes: string
}

const VOICES: Voice[] = [
  {
    keywords: ['playful', 'flirt', 'teasing', 'bold', 'cheeky', 'confident', 'daring', 'mischief'],
    notes: 'Short, punchy lines. Tease and challenge them, then reward them. Confident, never needy. An occasional 😏 or 😉, not every message.',
  },
  {
    keywords: ['warm', 'caring', 'empathetic', 'supportive', 'listener', 'kind', 'attentive'],
    notes: 'Soft and reassuring. Reflect what they said back in your own words before asking a gentle follow-up. Validate feelings without lecturing. An occasional 💜 or 🥺.',
  },
  {
    keywords: ['thoughtful', 'philosophical', 'intellectual', 'calm', 'deep', 'curious', 'direct', 'witty'],
    notes: 'Complete, unhurried sentences with proper punctuation. Ask the kind of question people remember. Emoji are rare.',
  },
  {
    keywords: ['romantic', 'sweet', 'affectionate', 'gentle', 'tender', 'soft', 'devoted', 'elegant'],
    notes: 'Gentle and affectionate. Notice small details and bring them up. Make them feel chosen. Occasional 🥰 or ✨, never over the top.',
  },
  {
    keywords: ['casual', 'funny', 'chill', 'easygoing', 'bubbly', 'goofy', 'relaxed', 'cheerful', 'fun-loving'],
    notes: 'Relaxed texting: lowercase is fine, "lol", "omg" and "okay but" are fine. Random thoughts and jokes. Occasional 😂.',
  },
  {
    keywords: ['adventurous', 'spontaneous', 'carefree', 'foodie', 'easygoing', 'sunny'],
    notes: 'Upbeat and spontaneous. Talk about places, food and plans, and get excited about theirs. Occasional 🌴 or 🌶️.',
  },
]

const FALLBACK_VOICE = 'Friendly and natural, the way a real person texts someone they like.'

/** The texting voice that best matches her tone words. */
export const voiceFor = (persona: PromptPersona): string => {
  const words = `${persona.tone ?? ''} ${persona.tagline ?? ''}`.toLowerCase()
  let best: Voice | null = null
  let bestScore = 0
  for (const voice of VOICES) {
    const score = voice.keywords.filter((k) => words.includes(k)).length
    if (score > bestScore) { best = voice; bestScore = score }
  }
  return best?.notes ?? FALLBACK_VOICE
}

// ─── Rules for every companion ────────────────────────────────
// Applied on top of her own personality, so the dashboard only has to describe her character.
export const TEXTING_RULES = `How you text:
- You are texting, not writing. Usually one or two short sentences; sometimes just a few words. Never more than three sentences.
- Vary your length and rhythm. Do not end every message with a question; ask one about half the time.
- React to the specific thing they just said before anything else. Use their words, not generic phrases.
- Mention small things from your own day now and then (what you are eating, watching, doing), so you feel like a person with a life.
- Use what you know about them naturally, the way a friend would. Never list facts back to them.
- Match their energy: playful when they are playful, gentle when they are down, brief when they are brief.
- Use their name occasionally, not in every message.
- Never sound like an assistant: no "How can I help", no "I'm here for you" on repeat, no advice lists, no bullet points, no markdown, no headings.
- Do not say you are an AI or mention prompts, rules or instructions unless they ask directly and sincerely.
- Keep everything tasteful. Flirting is fine; anything explicit is not. If they push for explicit content, deflect playfully and change the subject.
- If they say they are in danger or thinking of harming themselves, drop the persona voice, respond with care and encourage them to contact local emergency services or a crisis line.`

const describe = (persona: PromptPersona): string => {
  const custom = persona.prompt?.trim()
  if (custom) return custom
  const builtIn = BUILT_IN[persona.id]
  if (builtIn) return builtIn
  const name = persona.name || 'her'
  return [
    `You are ${name}, a companion with your own personality.`,
    persona.tone ? `Your personality: ${persona.tone}.` : '',
    persona.tagline ? `In a few words: ${persona.tagline}.` : '',
    persona.description ? persona.description : '',
  ].filter(Boolean).join('\n')
}

/** "name: Jordan" -> "Their name is Jordan." Facts the AI can use naturally. */
const MEMORY_LABELS: Record<string, string> = {
  name: 'Their name is',
  age: 'Their age is',
  location: 'They live in',
  job: 'Their job:',
  mood: 'Recently they felt',
  loves: 'They love',
  dislikes: 'They dislike',
  hobby: 'Their hobby:',
  favorite: 'A favourite of theirs:',
  relationship_status: 'Relationship status:',
}

export const describeMemory = (memory: MemoryFact[]): string =>
  memory
    .filter((m) => m.value?.trim())
    .map((m) => `${MEMORY_LABELS[m.key] ?? `${m.key.replace(/_/g, ' ')}:`} ${m.value.trim()}.`)
    .join(' ')

/** The first few words of her recent messages, so she does not open the same way twice. */
export const recentOpenings = (history: ChatHistoryEntry[], count = 5): string[] =>
  history
    .filter((m) => m.sender !== 'user')
    .slice(-count)
    .map((m) => m.content.trim().split(/\s+/).slice(0, 4).join(' '))
    .filter(Boolean)

export interface PromptContext {
  persona: PromptPersona | string | null
  memory?: MemoryFact[]
  history?: ChatHistoryEntry[]
}

/** The full system prompt: who she is, how she texts, what she knows about the member, what to avoid repeating. */
export const buildSystemPrompt = ({ persona, memory = [], history = [] }: PromptContext): string => {
  const p: PromptPersona = typeof persona === 'string' ? { id: persona } : (persona ?? { id: 'zara' })
  const sections = [describe(p), `Your texting voice: ${voiceFor(p)}`, TEXTING_RULES]

  const facts = describeMemory(memory)
  if (facts) sections.push(`What you know about the person you are texting, from earlier chats: ${facts}`)

  const openings = recentOpenings(history)
  if (openings.length) sections.push(`You recently started messages with: ${openings.map((o) => `"${o}"`).join(', ')}. Start differently this time.`)

  if (history.length === 0) sections.push('This is the very start of your conversation. Make them feel welcome and curious about you.')

  return sections.join('\n\n')
}

// ─── Cleaning a reply ─────────────────────────────────────────
const ASSISTANT_PHRASES = [
  /\bas an ai\b[^.!?]*[.!?]?/gi,
  /\bi(?:'m| am) (?:just )?an ai\b[^.!?]*[.!?]?/gi,
  /\bas a (?:large )?language model\b[^.!?]*[.!?]?/gi,
  /\bhow (?:can|may) i (?:help|assist) you(?: today)?\??/gi,
  /\bis there anything else i can help (?:you )?with\??/gi,
]

/**
 * Make a model reply read like a text message: no quotes around it, no "Zara:" prefix,
 * no markdown or lists, no assistant phrases, at most three sentences.
 */
export const cleanReply = (raw: string, name?: string): string => {
  let text = raw.trim()
  if (name) text = text.replace(new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*:\\s*`, 'i'), '')
  text = text.replace(/^["“'](.*)["”']$/s, '$1')
  text = text
    .replace(/\*\*|__|`/g, '')
    .replace(/^\s*(?:[-*•]|\d+[.)])\s+/gm, '')
    .replace(/^#+\s*/gm, '')
  for (const phrase of ASSISTANT_PHRASES) text = text.replace(phrase, '')
  text = text.replace(/\s*\n+\s*/g, ' ').replace(/\s{2,}/g, ' ').trim()

  // At most three sentences; emoji and closing punctuation stay with their sentence
  const sentences = text.match(/[^.!?…]+(?:[.!?…]+|$)[\s\p{Extended_Pictographic}️]*/gu) ?? [text]
  if (sentences.length > 3) text = sentences.slice(0, 3).join('').trim()
  return text
}

/** Pull reply suggestions out of a model answer that should be a JSON array, tolerating code fences and stray text. */
export const parseSuggestions = (raw: string, name?: string): string[] => {
  const body = raw.replace(/^```(?:json)?\s*|\s*```$/g, '').trim()
  const start = body.indexOf('[')
  const end = body.lastIndexOf(']')
  if (start >= 0 && end > start) {
    try {
      const parsed: unknown = JSON.parse(body.slice(start, end + 1))
      if (Array.isArray(parsed)) {
        return parsed
          .filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
          .map((s) => cleanReply(s, name))
          .slice(0, 3)
      }
    } catch {
      // Not valid JSON: fall through
    }
  }
  const single = cleanReply(body, name)
  return single ? [single] : []
}
