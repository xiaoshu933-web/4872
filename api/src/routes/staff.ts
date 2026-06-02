import { Router } from 'express'
import { generateQR, getMerchants, approveMerchant, rejectMerchant, getStatistics } from '../controllers/staffController'
import { authenticate } from '../middlewares/authenticate'

const router = Router()

router.get('/qr-code', generateQR)
router.get('/merchants', authenticate, getMerchants)
router.post('/merchants/:id/approve', authenticate, approveMerchant)
router.post('/merchants/:id/reject', authenticate, rejectMerchant)
router.get('/statistics', authenticate, getStatistics)

export { router as staffRoutes }
