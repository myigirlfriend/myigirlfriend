import { openai } from '../config/openai'
import { memoryRepository } from '../repositories'
import type { MemoryFact } from '../types'
import { isRecord } from '../utils/validate'

const REGEX_PATTERNS: { regex: RegExp; key: string }[] = [
  { regex: /my name is (\w+)/i,            key: 'name' },
  { regex: /call me (\w+)/i,               key: 'name' },
  { regex: /i(?:'m| am) (\d+)(?: years)?/i, key: 'age' },
  { regex: /i(?:'m| am) from ([\w\s,]+)/i, key: 'location' },
  { regex: /i live in ([\w\s,]+)/i,        key: 'location' },
  { regex: /i work (?:as |at )?([\w\s]+)/i, key: 'job' },
  { regex: /i(?:'m| am) a(?:n)? ([\w\s]+)/i, key: 'job' },
  { regex: /i love ([\w\s]+)/i,            key: 'loves' },
  { regex: /i hate ([\w\s]+)/i,            key: 'dislikes' },
  { regex: /my (?:favourite|favorite) ([\w]+) is ([\w\s]+)/i, key: 'favorite' },
  { regex: /i(?:'m| am) feeling ([\w\s]+)/i, key: 'mood' },
]

// Simple regex extraction — works without OpenAI credits
const extractWithRegex = (message: string): MemoryFact[] => {
  const facts: MemoryFact[] = []
  for (const { regex, key } of REGEX_PATTERNS) {
    const value = message.match(regex)?.[1]?.trim()
    if (value) facts.push({ key, value })
  }
  return facts
}

// AI-powered extraction — used when OpenAI is available
const extractWithAI = async (message: string): Promise<MemoryFact[]> => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `Extract personal facts from the user message as JSON array.
Format: [{"key": "name", "value": "John"}, {"key": "job", "value": "teacher"}]
Only extract clear facts. Keys: name, age, location, job, mood, loves, dislikes, hobby, relationship_status.
If nothing to extract return empty array [].
Return ONLY the JSON array, nothing else.`,
      },
      { role: 'user', content: message },
    ],
    max_tokens: 150,
    temperature: 0.1,
  })

  const parsed: unknown = JSON.parse(response.choices[0]?.message.content?.trim() ?? '')
  if (!Array.isArray(parsed)) throw new Error('Expected a JSON array of facts')
  return parsed.flatMap((fact): MemoryFact[] =>
    isRecord(fact) && typeof fact.key === 'string' && fact.key && fact.value != null && fact.value !== ''
      ? [{ key: fact.key, value: String(fact.value) }]
      : []
  )
}

export const formatMemoryForPrompt = (memory: MemoryFact[]): string =>
  memory.map((m) => `${m.key}: ${m.value}`).join(', ')

export const memoryService = {
  getMemory(userId: string): Promise<MemoryFact[]> {
    return memoryRepository.findByUser(userId)
  },

  /** Pull personal facts out of a message and remember them. Tries AI first, falls back to regex. */
  async extractAndSave(userId: string, message: string): Promise<void> {
    let facts: MemoryFact[]
    try {
      facts = await extractWithAI(message)
    } catch {
      // OpenAI unavailable — use regex
      facts = extractWithRegex(message)
    }

    for (const { key, value } of facts) {
      await memoryRepository.upsert(userId, key, value)
    }
  },
}
