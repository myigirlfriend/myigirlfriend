import { Router } from 'express'
import { authController } from '../controllers/auth.controller'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()

router.post('/register', asyncHandler(authController.register))
router.post('/login', asyncHandler(authController.login))
// Google OAuth sync — creates or finds user from Google login
router.post('/google', asyncHandler(authController.google))

export default router
