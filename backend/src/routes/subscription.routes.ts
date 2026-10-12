import { Router } from 'express'
import { subscriptionController } from '../controllers/subscription.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()

router.post('/checkout', authMiddleware, asyncHandler(subscriptionController.checkout))
// Stripe webhook — authenticated by its signature, not a JWT
router.post('/webhook', asyncHandler(subscriptionController.webhook))
router.get('/status', authMiddleware, asyncHandler(subscriptionController.status))
router.post('/cancel', authMiddleware, asyncHandler(subscriptionController.cancel))

export default router
