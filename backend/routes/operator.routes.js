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

  try {
    const suggestions = await generateSuggestions(conv.persona_id, messages || [])
    ok(res, { suggestions })
  } catch (e) {
    // OpenAI quota exceeded or unavailable — return placeholder suggestions
    ok(res, {
      suggestions: [
        "Hey, I'm here for you",
        "Tell me more, I'm listening...",
        "That's really interesting, go on 😊"
      ]
    })
  }
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

// Get today's hours
router.get('/hours', async (req, res) => {
  const operatorId = req.operator.id
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const { data: sessions } = await supabase
    .from('operator_sessions')
    .select('clock_in, clock_out')
    .eq('operator_id', operatorId)
    .gte('clock_in', todayStart.toISOString())
    .order('clock_in', { ascending: false })

  // Check if currently clocked in
  const activeSession = sessions?.find(s => !s.clock_out)

  // Calculate total minutes today (excluding current session)
  const totalMinutesToday = (sessions || [])
    .filter(s => s.clock_out)
    .reduce((sum, s) => {
      const mins = Math.floor(
        (new Date(s.clock_out) - new Date(s.clock_in)) / 60000
      )
      return sum + mins
    }, 0)

  ok(res, {
    totalMinutesToday,
    activeSince: activeSession?.clock_in || null,
  })
})

// Clock in
router.post('/hours/clockin', async (req, res) => {
  const operatorId = req.operator.id

  // Check not already clocked in
  const { data: active } = await supabase
    .from('operator_sessions')
    .select('id')
    .eq('operator_id', operatorId)
    .is('clock_out', null)
    .single()

  if (active) return err(res, 'Already clocked in')

  const { data: session } = await supabase
    .from('operator_sessions')
    .insert({ operator_id: operatorId })
    .select().single()

  ok(res, { session })
})

// Clock out
router.post('/hours/clockout', async (req, res) => {
  const operatorId = req.operator.id

  // Find active session
  const { data: active } = await supabase
    .from('operator_sessions')
    .select('id, clock_in')
    .eq('operator_id', operatorId)
    .is('clock_out', null)
    .single()

  if (!active) return err(res, 'Not clocked in')

  await supabase
    .from('operator_sessions')
    .update({ clock_out: new Date().toISOString() })
    .eq('id', active.id)

  // Recalculate today total
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const { data: sessions } = await supabase
    .from('operator_sessions')
    .select('clock_in, clock_out')
    .eq('operator_id', operatorId)
    .gte('clock_in', todayStart.toISOString())

  const totalMinutesToday = (sessions || [])
    .filter(s => s.clock_out)
    .reduce((sum, s) => {
      const mins = Math.floor(
        (new Date(s.clock_out) - new Date(s.clock_in)) / 60000
      )
      return sum + mins
    }, 0)

  ok(res, { totalMinutesToday })
})

module.exports = router
