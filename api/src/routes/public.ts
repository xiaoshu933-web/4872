import { Router } from 'express'
import { getContent, getPrizes } from '../controllers/publicController'

const router = Router()

router.get('/content', getContent)
router.get('/prizes', getPrizes)

export { router as publicRoutes }
