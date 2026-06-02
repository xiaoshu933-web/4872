import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Key } from 'lucide-react'
import { useUserStore } from '@/stores/userStore'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { user, login } = useUserStore()
  const [keyword, setKeyword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      navigate('/admin')
    }
  }, [user, navigate])

  const handleLogin = () => {
    if (keyword === '地球') {
      const token = 'admin-token-' + Date.now()
      const userData = {
        id: 'admin-' + Date.now(),
        phone: '管理员',
        role: 'admin',
      }
      login(token, userData)
      navigate('/admin')
    } else {
      setError('密钥错误，请重新输入')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-gray-800 mb-4">
            管理人员登录
          </h1>
          <p className="text-gray-600">请输入管理密钥</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-700 mb-2 font-medium">
                <Key className="inline mr-2 w-4 h-4" />
                密钥
              </label>
              <input
                type="text"
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value)
                  setError('')
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="请输入管理密钥"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 transition-colors text-gray-800 bg-white"
                style={{ color: '#1f2937' }}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-50 py-3 rounded">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              className="w-full bg-gray-800 text-white py-4 rounded-lg hover:bg-gray-700 transition-colors font-medium text-lg"
            >
              登录
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            提示：演示环境，密钥为"地球"
          </p>
        </div>
      </div>
    </div>
  )
}
