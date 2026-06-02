import { Router } from 'express'
import { apply, getStatus } from '../controllers/merchantController'
import { authenticate } from '../middlewares/authenticate'

const router = Router()

router.post('/apply', authenticate, apply)
router.get('/status', authenticate, getStatus)

export { router as merchantRoutes }
