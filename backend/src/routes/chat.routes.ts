import { Router } from 'express'
import { chatController } from '../controllers/chat.controller'
import { anyAuth, authMiddleware } from '../middleware/auth.middleware'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()

router.post('/start', authMiddleware, asyncHandler(chatController.start))
router.post('/send', authMiddleware, asyncHandler(chatController.send))
// Accepts both user AND operator JWT tokens
router.get('/history/:conversationId', anyAuth, asyncHandler(chatController.history))
router.get('/conversations', authMiddleware, asyncHandler(chatController.conversations))

export default router
