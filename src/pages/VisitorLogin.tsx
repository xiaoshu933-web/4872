import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Gift, Phone, CreditCard } from 'lucide-react'
import { useUserStore } from '@/stores/userStore'
import type { User } from '@/types'

export default function VisitorLogin() {
  const navigate = useNavigate()
  const { login, isAuthenticated, hydrateFromLocalStorage } = useUserStore()
  const [formData, setFormData] = useState({
    phone: '',
    code: '',
  })
  const [codeSent, setCodeSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    hydrateFromLocalStorage()
    if (isAuthenticated) {
      const role = localStorage.getItem('role')
      if (role === 'visitor') {
        navigate('/lottery')
      }
    }
  }, [isAuthenticated, navigate, hydrateFromLocalStorage])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSendCode = () => {
    if (!formData.phone || !/^1[3-9]\d{9}$/.test(formData.phone)) {
      setError('请输入有效的手机号')
      return
    }
    setError('')
    setCodeSent(true)
    setCountdown(60)
    alert('验证码已发送（演示模式：任意6位数字即可）')
  }

  const handleLogin = () => {
    if (!formData.phone || !formData.code) {
      setError('请填写完整信息')
      return
    }
    if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      setError('请输入有效的手机号')
      return
    }
    if (formData.code.length !== 6) {
      setError('验证码为6位数字')
      return
    }

    const mockToken = 'visitor_token_' + Date.now()
    const mockUserId = 'visitor_' + Date.now()
    const now = new Date().toISOString()
    const user: User = {
      id: mockUserId,
      phone: formData.phone,
      role: 'visitor',
      createdAt: now,
      updatedAt: now,
    }
    login(mockToken, user)
    navigate('/lottery')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Gift className="w-20 h-20 mx-auto mb-4 text-gray-700" />
          <h1 className="text-4xl font-serif font-bold text-gray-800 mb-4">
            游客登录
          </h1>
          <p className="text-gray-600">登录后即可参与抽奖活动</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-700 mb-2 font-medium">
                <Phone className="inline mr-2 w-4 h-4" />
                手机号
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="请输入手机号"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 transition-colors bg-white"
                style={{ color: '#1f2937' }}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2 font-medium">
                <CreditCard className="inline mr-2 w-4 h-4" />
                验证码
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="请输入6位验证码"
                  maxLength={6}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 transition-colors bg-white"
                  style={{ color: '#1f2937' }}
                />
                <button
                  onClick={handleSendCode}
                  disabled={codeSent && countdown > 0}
                  className={`px-6 py-3 rounded-lg border-2 transition-colors whitespace-nowrap font-medium ${
                    codeSent && countdown > 0
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                      : 'border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {codeSent && countdown > 0 ? `${countdown}秒` : '获取验证码'}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 py-2 rounded">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              className="w-full bg-gray-800 text-white py-4 rounded-lg hover:bg-gray-700 transition-colors font-medium text-lg"
            >
              登录并参与抽奖
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            提示：演示环境，输入任意11位手机号 + 任意6位数字验证码即可登录
          </p>
        </div>
      </div>
    </div>
  )
}
