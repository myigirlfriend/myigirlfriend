import { Router } from 'express'
import { operatorController } from '../controllers/operator.controller'
import { adminOnly, operatorMiddleware } from '../middleware/auth.middleware'
import { asyncHandler } from '../utils/asyncHandler'

const router = Router()

router.post('/login', asyncHandler(operatorController.login))

// All routes below require operator auth
router.use(operatorMiddleware)

router.get('/queue', asyncHandler(operatorController.queue))
router.post('/assign', adminOnly, asyncHandler(operatorController.assign))
router.get('/agents', adminOnly, asyncHandler(operatorController.agents))
router.post('/agents', adminOnly, asyncHandler(operatorController.createAgent))
router.post('/agents/:id/password', adminOnly, asyncHandler(operatorController.resetAgentPassword))
router.delete('/agents/:id', adminOnly, asyncHandler(operatorController.deleteAgent))
router.post('/suggest', asyncHandler(operatorController.suggest))
router.post('/reply', asyncHandler(operatorController.reply))

router.get('/hours', asyncHandler(operatorController.hours))
router.post('/hours/clockin', asyncHandler(operatorController.clockIn))
router.post('/hours/clockout', asyncHandler(operatorController.clockOut))

router.get('/admin/hours', adminOnly, asyncHandler(operatorController.adminHours))
router.get('/admin/overview', adminOnly, asyncHandler(operatorController.overview))

export default router
