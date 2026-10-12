import { Router } from 'express'
import { profileController } from '../controllers/profile.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()

router.get('/stats', authMiddleware, asyncHandler(profileController.stats))

export default router
