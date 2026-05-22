const supabase = require('../config/supabase')
const { generateReply } = require('../services/ai.service')
const { ok, err } = require('../utils/response')

const FREE_LIMIT = 5

// Start or resume a conversation with a persona
const startChat = async (req, res) => {
  const { personaId } = req.body
  const userId = req.user.id
  if (!personaId) return err(res, 'personaId required')

  // Check for existing open conversation
  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
    .eq('user_id', userId)
    .eq('persona_id', personaId)
    .eq('status', 'active')
    .single()

  if (existing) return ok(res, { conversationId: existing.id })

  const { data: conv, error } = await supabase
    .from('conversations')
    .insert({ user_id: userId, persona_id: personaId, status: 'active' })
    .select().single()

  if (error) return err(res, 'Could not start conversation', 500)
  ok(res, { conversationId: conv.id }, 201)
}

// Send message and get AI reply
const sendMessage = async (req, res) => {
  const { conversationId, content } = req.body
  const userId = req.user.id
  if (!conversationId || !content) return err(res, 'conversationId and content required')

  // Fetch conversation + subscription check
  const { data: conv } = await supabase
    .from('conversations')
    .select('*, personas(id, name)')
    .eq('id', conversationId)
    .eq('user_id', userId)
    .single()
  if (!conv) return err(res, 'Conversation not found', 404)

// Usage check — enforced server side
const [usageResult, subResult] = await Promise.all([
  supabase.from('usage_tracking').select('message_count').eq('user_id', userId).single(),
  supabase.from('subscriptions').select('plan, status').eq('user_id', userId).single()
])

const isPaid = subResult.data?.status === 'active'
const count = usageResult.data?.message_count || 0

// Hard block on backend — cannot be bypassed from frontend
if (!isPaid && count >= FREE_LIMIT) {
  return ok(res, {
    triggerUpsell: true,
    message: null,
    reason: 'free_limit_reached'
  })
}

  // Save user message
  await supabase.from('messages').insert({
    conversation_id: conversationId,
    sender: 'user',
    content,
  })

  // Fetch conversation history for context
  const { data: history } = await supabase
    .from('messages')
    .select('sender, content, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(30)

// Fetch user memory
const { data: memory } = await supabase
  .from('user_memory')
  .select('key, value')
  .eq('user_id', userId)

// Extract and save memory from user message (non-blocking)
const memoryService = require('../services/memory.service')
memoryService.extractAndSave(userId, content).catch(() => {})

let replyContent
try {
  replyContent = await generateReply(conv.personas.id, memory || [], history || [])
} catch (e) {
  replyContent = "Hey, I'm here for you"
}
  // Save AI reply
  const { data: aiMessage } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender: 'ai', content: replyContent })
    .select().single()

  // Increment usage
  await supabase.from('usage_tracking')
    .update({ message_count: count + 1 })
    .eq('user_id', userId)

  const newCount = count + 1
  ok(res, {
    message: aiMessage,
    triggerUpsell: !isPaid && newCount >= FREE_LIMIT,
  })
}

// Get conversation message history
const getHistory = async (req, res) => {
  const { conversationId } = req.params
  const role = req.user?.role
  const isOperator = role === 'admin' || role === 'agent'

  if (!isOperator) {
    const { data: conv } = await supabase
      .from('conversations').select('id')
      .eq('id', conversationId)
      .eq('user_id', req.user.id)
      .single()
    if (!conv) return err(res, 'Not found', 404)
  }

  const { data: messages } = await supabase
    .from('messages').select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  ok(res, { messages: messages || [] })
}

module.exports = { startChat, sendMessage, getHistory }
