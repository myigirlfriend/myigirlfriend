const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { authMiddleware } = require('../middleware/auth.middleware')
const { startChat, sendMessage, getHistory } = require('../controllers/chat.controller')
const { err } = require('../utils/response')

// Accepts both user AND operator JWT tokens
const anyAuth = (req, res, next) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return err(res, 'Unauthorized', 401)
  try {
    req.user = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET)
    next()
  } catch {
    err(res, 'Invalid token', 401)
  }
}

router.post('/start', authMiddleware, startChat)
router.post('/send', authMiddleware, sendMessage)
router.get('/history/:conversationId', anyAuth, getHistory)
// Get all conversations for logged in user
router.get('/conversations', authMiddleware, async (req, res) => {
  const supabase = require('../config/supabase')
  const { ok } = require('../utils/response')
  const userId = req.user.id

  const { data: convs } = await supabase
    .from('conversations')
    .select('id, persona_id, created_at, status, messages(content, created_at)')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  const mapped = (convs || []).map(c => {
    const msgs = c.messages || []
    const lastMsg = msgs.sort((a, b) =>
      new Date(b.created_at) - new Date(a.created_at)
    )[0]

    return {
      id: c.id,
      personaId: c.persona_id,
      createdAt: c.created_at,
      lastMessage: lastMsg?.content?.slice(0, 60) || null,
      lastMessageAt: lastMsg?.created_at || c.created_at,
    }
  })

  ok(res, { conversations: mapped })
})

module.exports = router