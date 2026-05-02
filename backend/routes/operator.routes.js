const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const supabase = require('../config/supabase')
const { generateSuggestions } = require('../services/ai.service')
const { operatorMiddleware } = require('../middleware/auth.middleware')
const { ok, err } = require('../utils/response')

// Operator login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const { data: operator } = await supabase.from('operators').select('*').eq('email', email).single()
  if (!operator) return err(res, 'Invalid credentials', 401)
  const valid = await bcrypt.compare(password, operator.password_hash)
  if (!valid) return err(res, 'Invalid credentials', 401)

  const token = jwt.sign(
    { id: operator.id, name: operator.name, email: operator.email, role: 'operator' },
    process.env.JWT_SECRET, { expiresIn: '12h' }
  )
  ok(res, { operator: { id: operator.id, name: operator.name, email: operator.email, token } })
})

// All routes below require operator auth
router.use(operatorMiddleware)

// Get active conversation queue
router.get('/queue', async (req, res) => {
  const { data: convs } = await supabase
    .from('conversations')
    .select('id, status, created_at, users(name), personas(name), messages(count)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(50)

  const mapped = (convs || []).map(c => ({
    id: c.id,
    userName: c.users?.name || 'Unknown',
    personaName: c.personas?.name || 'Unknown',
    messageCount: c.messages?.[0]?.count || 0,
    createdAt: c.created_at,
  }))
  ok(res, { conversations: mapped })
})

// Generate AI reply suggestions for operator
router.post('/suggest', async (req, res) => {
  const { conversationId, messages } = req.body

  const { data: conv } = await supabase
    .from('conversations').select('persona_id').eq('id', conversationId).single()
  if (!conv) return err(res, 'Conversation not found', 404)

  const suggestions = await generateSuggestions(conv.persona_id, messages || [])
  ok(res, { suggestions })
})

// Operator sends a reply (as persona)
router.post('/reply', async (req, res) => {
  const { conversationId, content } = req.body
  if (!conversationId || !content) return err(res, 'Missing fields')

  const { data: msg } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender: 'operator', content })
    .select().single()

  ok(res, { message: msg })
})

module.exports = router
