import { Router } from 'express'
import { getContent, updateContent } from '../controllers/adminController'
import { authenticate } from '../middlewares/authenticate'

const router = Router()

router.get('/content', authenticate, getContent)
router.put('/content', authenticate, updateContent)

export { router as adminRoutes }
