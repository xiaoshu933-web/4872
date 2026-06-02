import api from './api'
import type { DrawCount, Prize, LotteryRecord, ApiResponse, Receipt } from '@/types'

export const lotteryService = {
  async getDrawCount(): Promise<ApiResponse<DrawCount>> {
    return api.get('/visitor/draw-count')
  },

  async draw(): Promise<ApiResponse<{ prize: Prize; verificationCode: string; remainingDrawCount: number }>> {
    return api.post('/visitor/draw')
  },

  async getRecords(): Promise<ApiResponse<LotteryRecord[]>> {
    return api.get('/visitor/prizes')
  },

  async uploadReceipt(transactionId: string, platform: 'wechat' | 'alipay'): Promise<ApiResponse<{ drawCountAdded: number; totalDrawCount: number }>> {
    return api.post('/visitor/upload-receipt', { transactionId, platform })
  },

  async scanQR(qrCode: string): Promise<ApiResponse> {
    return api.post('/visitor/scan-qr', { qrCode })
  },

  async getPrizes(): Promise<ApiResponse<Prize[]>> {
    return api.get('/public/prizes')
  },
}
