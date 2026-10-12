import { Router } from 'express'
import { personaController } from '../controllers/persona.controller'
import { authMiddleware } from '../middleware/auth.middleware'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()

router.use(authMiddleware)

router.get('/', asyncHandler(personaController.list))
router.get('/:id', asyncHandler(personaController.getOne))

export default router
