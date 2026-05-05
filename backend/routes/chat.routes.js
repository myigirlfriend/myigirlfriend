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

module.exports = router