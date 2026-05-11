const supabase = require('../config/supabase')
const openai = require('../config/openai')

const getMemory = async (userId) => {
  const { data } = await supabase
    .from('user_memory')
    .select('key, value')
    .eq('user_id', userId)
  return data || []
}

const setMemory = async (userId, key, value) => {
  await supabase.from('user_memory').upsert(
    { user_id: userId, key, value },
    { onConflict: 'user_id,key' }
  )
}

// Simple regex extraction — works without OpenAI credits
const extractWithRegex = (message) => {
  const facts = []
  const patterns = [
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
  for (const { regex, key } of patterns) {
    const match = message.match(regex)
    if (match) facts.push({ key, value: match[1].trim() })
  }
  return facts
}

// AI-powered extraction — used when OpenAI is available
const extractWithAI = async (message) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `Extract personal facts from the user message as JSON array.
Format: [{"key": "name", "value": "John"}, {"key": "job", "value": "teacher"}]
Only extract clear facts. Keys: name, age, location, job, mood, loves, dislikes, hobby, relationship_status.
If nothing to extract return empty array [].
Return ONLY the JSON array, nothing else.`
      },
      { role: 'user', content: message }
    ],
    max_tokens: 150,
    temperature: 0.1,
  })

  const text = response.choices[0].message.content.trim()
  return JSON.parse(text)
}

// Main function — tries AI first, falls back to regex
const extractAndSave = async (userId, message) => {
  let facts = []

  try {
    facts = await extractWithAI(message)
  } catch {
    // OpenAI unavailable — use regex
    facts = extractWithRegex(message)
  }

  // Save all extracted facts
  for (const { key, value } of facts) {
    if (key && value) await setMemory(userId, key, value)
  }
}

const formatMemoryForPrompt = (memory) => {
  if (!memory || memory.length === 0) return ''
  return memory.map(m => `${m.key}: ${m.value}`).join(', ')
}

module.exports = { getMemory, setMemory, extractAndSave, formatMemoryForPrompt }