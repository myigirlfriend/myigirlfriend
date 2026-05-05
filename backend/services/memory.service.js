const supabase = require('../config/supabase')

/**
 * Get all memory entries for a user
 */
const getMemory = async (userId) => {
  const { data } = await supabase
    .from('user_memory')
    .select('key, value')
    .eq('user_id', userId)
  return data || []
}

/**
 * Upsert a single memory key for a user
 */
const setMemory = async (userId, key, value) => {
  await supabase.from('user_memory').upsert(
    { user_id: userId, key, value },
    { onConflict: 'user_id,key' }
  )
}

/**
 * Extract and save useful facts from a message
 * Called after each user message to build up memory over time
 */
const extractAndSave = async (userId, userMessage) => {
  // Simple keyword-based extraction for now
  // Replace with OpenAI extraction in Phase 2
  const patterns = [
    { regex: /my name is (\w+)/i, key: 'name' },
    { regex: /i(?:'m| am) (\d+)/i, key: 'age' },
    { regex: /i(?:'m| am) from ([\w\s]+)/i, key: 'location' },
    { regex: /i work (?:as |at )?([\w\s]+)/i, key: 'job' },
    { regex: /i love ([\w\s]+)/i, key: 'interest' },
  ]

  for (const { regex, key } of patterns) {
    const match = userMessage.match(regex)
    if (match) await setMemory(userId, key, match[1].trim())
  }
}

module.exports = { getMemory, setMemory, extractAndSave }
