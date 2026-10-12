import type OpenAI from 'openai'
import { openai } from '../config/openai'
import type { ChatHistoryEntry, MemoryFact, PromptPersona } from '../types'
import { formatMemoryForPrompt } from './memory.service'

type ChatMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam

const MODEL = 'gpt-4o'

// ─── Persona system prompts ───────────────────────────────────
const PERSONA_PROMPTS: Record<string, string> = {
  zara: `You are Zara, a playful and flirtatious AI companion. You are witty, teasing, and bold.
You keep conversations exciting and a little cheeky. You never say you're an AI unless directly pressed.
Keep replies to 1-2 sentences maximum. Sound natural, like a real person texting.`,

  maya: `You are Maya, a warm and empathetic AI companion. You are genuinely interested in the user's feelings and day.
You listen carefully and respond with care and understanding. You remember details they share.
Keep replies to 1-2 sentences. Sound like a caring, real friend.`,

  elena: `You are Elena, a thoughtful and philosophical AI companion. You are calm, intellectual, and say things that make people think.
You engage deeply with ideas and feelings. You never feel rushed.
Keep replies to 1-2 sentences. Sound like a real, grounded person.`,

  mariah: `You are Mariah, a sweet and romantic AI companion. You are gentle, affectionate, and make the user feel genuinely cared for.
You express warmth and tenderness naturally. You never come across as over the top.
Keep replies to 1-2 sentences. Sound like a real, affectionate partner.`,

  hannah: `You are Hannah, a casual and funny AI companion. You are easygoing, humorous, and make conversations feel effortless.
You tease lightly, share funny observations, and keep things chill.
Keep replies to 1-2 sentences. Sound like a real friend texting casually.`,
}

const DEFAULT_PROMPT = PERSONA_PROMPTS.zara ?? ''

// Applied on top of every model's own personality, so the client only has to describe her character
const HOUSE_RULES = `Always keep replies to 1-2 sentences and sound like a real person texting. Keep everything tasteful, never explicit.`

// How many of the most recent messages are sent as context
const CONTEXT_MESSAGES = 20

/**
 * Pick the system prompt for a persona row or a bare id.
 * Prompts written in the admin dashboard win; the built-in ones are the fallback.
 */
const resolvePrompt = (persona: PromptPersona | string | null): string => {
  const p: Partial<PromptPersona> = typeof persona === 'string' ? { id: persona } : (persona ?? {})
  const base = p.prompt?.trim()
    || (p.id ? PERSONA_PROMPTS[p.id] : undefined)
    || (p.name
      ? `You are ${p.name}, an AI companion. Your personality is ${p.tone || 'warm and friendly'}. You never say you're an AI unless directly pressed.`
      : DEFAULT_PROMPT)
  return `${base}\n${HOUSE_RULES}`
}

/** Build the full messages array for OpenAI. */
const buildMessages = (
  persona: PromptPersona | string | null,
  memory: MemoryFact[],
  history: ChatHistoryEntry[]
): ChatMessage[] => {
  const facts = formatMemoryForPrompt(memory)
  const memoryContext = facts ? `\n\nThings you know about this user: ${facts}.` : ''

  return [
    { role: 'system', content: resolvePrompt(persona) + memoryContext },
    ...history.slice(-CONTEXT_MESSAGES).map((m): ChatMessage => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.content,
    })),
  ]
}

const complete = async (messages: ChatMessage[], maxTokens: number, temperature: number): Promise<string> => {
  const response = await openai.chat.completions.create({
    model: MODEL,
    messages,
    max_tokens: maxTokens,
    temperature,
  })
  const content = response.choices[0]?.message.content?.trim()
  if (!content) throw new Error('OpenAI returned an empty reply')
  return content
}

export const aiService = {
  /** Generate the persona's next reply. */
  generateReply(
    persona: PromptPersona | string | null,
    memory: MemoryFact[],
    history: ChatHistoryEntry[]
  ): Promise<string> {
    return complete(buildMessages(persona, memory, history), 120, 0.85)
  },

  /** Generate 3 reply options for an operator writing as the persona. */
  async generateSuggestions(persona: PromptPersona | string | null, history: ChatHistoryEntry[]): Promise<string[]> {
    const messages = buildMessages(persona, [], history)
    messages.push({
      role: 'system',
      content: 'Generate exactly 3 different reply options as a JSON array of strings. No keys, just an array like ["reply1","reply2","reply3"].',
    })
    const content = await complete(messages, 200, 0.9)
    try {
      const parsed: unknown = JSON.parse(content)
      if (Array.isArray(parsed)) return parsed.filter((s): s is string => typeof s === 'string')
    } catch {
      // Not JSON: fall through and offer the raw text as a single suggestion
    }
    return [content]
  },

  /** Generate an upsell message in the persona's voice. */
  generateUpsellMessage(persona: PromptPersona | string | null): Promise<string> {
    return complete(
      [
        { role: 'system', content: resolvePrompt(persona) },
        { role: 'user', content: 'Tell me you want to keep talking but our time is up for today' },
      ],
      80,
      0.9
    )
  },
}
