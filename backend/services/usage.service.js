const supabase = require('../config/supabase')

const FREE_LIMIT = 10

const getUsage = async (userId) => {
  const { data } = await supabase
    .from('usage_tracking')
    .select('message_count, last_reset')
    .eq('user_id', userId)
    .single()
  return data || { message_count: 0 }
}

const increment = async (userId) => {
  const usage = await getUsage(userId)
  await supabase
    .from('usage_tracking')
    .update({ message_count: (usage.message_count || 0) + 1 })
    .eq('user_id', userId)
  return usage.message_count + 1
}

const isAtLimit = async (userId) => {
  const usage = await getUsage(userId)
  return (usage.message_count || 0) >= FREE_LIMIT
}

const reset = async (userId) => {
  await supabase
    .from('usage_tracking')
    .update({ message_count: 0, last_reset: new Date().toISOString() })
    .eq('user_id', userId)
}

module.exports = { getUsage, increment, isAtLimit, reset }
