import { Router } from 'express'
import {
  bindPhone,
  bindIdentity,
  uploadReceipt,
  getDrawCount,
  draw,
  getPrizes,
  scanQR,
} from '../controllers/visitorController'
import { authenticate } from '../middlewares/authenticate'

const router = Router()

router.post('/bind-phone', authenticate, bindPhone)
router.post('/bind-identity', authenticate, bindIdentity)
router.post('/upload-receipt', authenticate, uploadReceipt)
router.get('/draw-count', authenticate, getDrawCount)
router.post('/draw', authenticate, draw)
router.post('/scan-qr', authenticate, scanQR)

export { router as visitorRoutes }
