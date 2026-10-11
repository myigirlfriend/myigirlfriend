const openai = require('../config/openai')

// ─── Persona system prompts ───────────────────────────────────
const PERSONA_PROMPTS = {
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

// Applied on top of every model's own personality, so the client only has to describe her character
const HOUSE_RULES = `Always keep replies to 1-2 sentences and sound like a real person texting. Keep everything tasteful, never explicit.`

/**
 * Pick the system prompt for a persona row ({ id, name, tone, prompt }) or a bare id.
 * Prompts written in the admin dashboard win; the built-in ones are the fallback.
 */
const resolvePrompt = (persona) => {
  const p = typeof persona === 'string' ? { id: persona } : (persona || {})
  const base = p.prompt?.trim()
    || PERSONA_PROMPTS[p.id]
    || (p.name
      ? `You are ${p.name}, an AI companion. Your personality is ${p.tone || 'warm and friendly'}. You never say you're an AI unless directly pressed.`
      : PERSONA_PROMPTS.zara)
  return `${base}\n${HOUSE_RULES}`
}

/**
 * Build the full messages array for OpenAI
 */
const buildMessages = (persona, memory, history) => {
  const systemPrompt = resolvePrompt(persona)
  const memoryContext = memory.length
    ? `\n\nThings you know about this user: ${memory.map(m => `${m.key}: ${m.value}`).join(', ')}.`
    : ''

  return [
    { role: 'system', content: systemPrompt + memoryContext },
    ...history.slice(-20).map(m => ({ // last 20 msgs for context window efficiency
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.content,
    })),
  ]
}

/**
 * Generate AI reply
 */
const generateReply = async (persona, memory, history) => {
  const messages = buildMessages(persona, memory, history)
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    max_tokens: 120,
    temperature: 0.85,
  })
  return response.choices[0].message.content.trim()
}

/**
 * Generate 3 operator reply suggestions
 */
const generateSuggestions = async (persona, history) => {
  const messages = buildMessages(persona, [], history)
  messages.push({
    role: 'system',
    content: 'Generate exactly 3 different reply options as a JSON array of strings. No keys, just an array like ["reply1","reply2","reply3"].',
  })
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    max_tokens: 200,
    temperature: 0.9,
  })
  try {
    return JSON.parse(response.choices[0].message.content.trim())
  } catch {
    return [response.choices[0].message.content.trim()]
  }
}

/**
 * Generate upsell message in persona voice
 */
const generateUpsellMessage = async (persona) => {
  const prompt = resolvePrompt(persona)
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: 'Tell me you want to keep talking but our time is up for today' },
    ],
    max_tokens: 80,
    temperature: 0.9,
  })
  return response.choices[0].message.content.trim()
}

module.exports = { generateReply, generateSuggestions, generateUpsellMessage }
