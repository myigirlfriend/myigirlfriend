import type OpenAI from 'openai'
import { openai } from '../config/openai'
import type { ChatHistoryEntry, MemoryFact, PromptPersona } from '../types'
import { buildSystemPrompt, cleanReply, parseSuggestions } from './prompt'

type ChatMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam
type PersonaRef = PromptPersona | string | null

const MODEL = 'gpt-4o'

// How many of the most recent messages are sent as context
const CONTEXT_MESSAGES = 24

// Sampling tuned for texting: varied wording, little repetition of words or topics
const SAMPLING = { temperature: 0.9, top_p: 0.95, presence_penalty: 0.4, frequency_penalty: 0.35 } as const

const nameOf = (persona: PersonaRef): string | undefined =>
  typeof persona === 'string' ? undefined : persona?.name ?? undefined

/** The messages array for OpenAI: her system prompt, then the recent conversation. */
const buildMessages = (persona: PersonaRef, memory: MemoryFact[], history: ChatHistoryEntry[]): ChatMessage[] => {
  const recent = history.slice(-CONTEXT_MESSAGES)
  return [
    { role: 'system', content: buildSystemPrompt({ persona, memory, history: recent }) },
    ...recent.map((m): ChatMessage => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.content,
    })),
  ]
}

const complete = async (messages: ChatMessage[], maxTokens: number): Promise<string> => {
  const response = await openai.chat.completions.create({ model: MODEL, messages, max_tokens: maxTokens, ...SAMPLING })
  const content = response.choices[0]?.message.content?.trim()
  if (!content) throw new Error('OpenAI returned an empty reply')
  return content
}

export const aiService = {
  /** Generate the persona's next reply. */
  async generateReply(persona: PersonaRef, memory: MemoryFact[], history: ChatHistoryEntry[]): Promise<string> {
    const reply = cleanReply(await complete(buildMessages(persona, memory, history), 120), nameOf(persona))
    if (!reply) throw new Error('The reply was empty after cleaning')
    return reply
  },

  /** Generate 3 reply options for an operator writing as the persona. */
  async generateSuggestions(persona: PersonaRef, history: ChatHistoryEntry[]): Promise<string[]> {
    const messages = buildMessages(persona, [], history)
    messages.push({
      role: 'system',
      content: 'Write 3 different replies she could send next, each in her voice and following the texting rules: one playful, one warm, one that asks them something. Answer with only a JSON array of 3 strings, like ["...","...","..."].',
    })
    return parseSuggestions(await complete(messages, 220), nameOf(persona))
  },

  /** Generate an upsell message in the persona's voice. */
  async generateUpsellMessage(persona: PersonaRef): Promise<string> {
    const reply = await complete(
      [
        { role: 'system', content: buildSystemPrompt({ persona }) },
        { role: 'user', content: 'Tell me, in one or two short sentences and in your own voice, that you want to keep talking but our free time is up for today.' },
      ],
      80,
    )
    return cleanReply(reply, nameOf(persona))
  },
}
