const router = require('express').Router()
const supabase = require('../config/supabase')
const { authMiddleware } = require('../middleware/auth.middleware')
const { ok } = require('../utils/response')

router.get('/stats', authMiddleware, async (req, res) => {
  const userId = req.user.id

  const { data: convs } = await supabase
    .from('conversations')
    .select('id, persona_id, created_at, messages(count)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5)

  const recentConversations = (convs || []).map(c => ({
    id: c.id,
    personaName: c.persona_id,
    messageCount: c.messages?.[0]?.count || 0,
    date: new Date(c.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' }),
  }))

  const totalMessages = recentConversations.reduce((sum, c) => sum + c.messageCount, 0)

  ok(res, {
    totalConversations: convs?.length || 0,
    totalMessages,
    recentConversations,
  })
})

module.exports = router