import { Router } from 'express'
import { personaController } from '../controllers/persona.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()

// The landing page shows the live models to visitors who are not signed in yet
router.get('/public', asyncHandler(personaController.list))

router.use(authMiddleware)

router.get('/', asyncHandler(personaController.list))
router.get('/:id', asyncHandler(personaController.getOne))

export default router
