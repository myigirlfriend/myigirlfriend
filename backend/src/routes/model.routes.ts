import { Router } from 'express'
import { modelController } from '../controllers/model.controller'
import { adminOnly, operatorMiddleware } from '../middleware/auth.middleware'
import { asyncHandler } from '../utils/asyncHandler'

// Models are the AI personas users chat with. Admin only.
const router = Router()

router.use(operatorMiddleware, adminOnly)

router.get('/', asyncHandler(modelController.list))
router.post('/', asyncHandler(modelController.create))
router.put('/:id', asyncHandler(modelController.update))
router.delete('/:id', asyncHandler(modelController.remove))

export default router
