import { Router } from 'express'
import { sendCode, login, getProfile } from '../controllers/authController'
import { authenticate } from '../middlewares/authenticate'

const router = Router()

router.post('/send-code', sendCode)
router.post('/login', login)
router.get('/profile', authenticate, getProfile)

export { router as authRoutes }
