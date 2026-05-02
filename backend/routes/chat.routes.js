const router = require('express').Router()
const { authMiddleware } = require('../middleware/auth.middleware')
const { startChat, sendMessage, getHistory } = require('../controllers/chat.controller')

router.use(authMiddleware)
router.post('/start', startChat)
router.post('/send', sendMessage)
router.get('/history/:conversationId', getHistory)

module.exports = router
