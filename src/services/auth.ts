import api from './api'
import type { User, ApiResponse } from '@/types'

export const authService = {
  async sendCode(phone: string): Promise<ApiResponse> {
    return api.post('/auth/send-code', { phone })
  },

  async login(phone: string, code: string): Promise<ApiResponse<{ token: string; user: User }>> {
    return api.post('/auth/login', { phone, code })
  },

  async getProfile(): Promise<ApiResponse<User>> {
    return api.get('/auth/profile')
  },

  async bindPhone(phone: string): Promise<ApiResponse> {
    return api.post('/visitor/bind-phone', { phone })
  },

  async bindIdentity(name: string, idCard: string): Promise<ApiResponse> {
    return api.post('/visitor/bind-identity', { name, idCard })
  },
}
