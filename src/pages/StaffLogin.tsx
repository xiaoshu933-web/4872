import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Key } from 'lucide-react'

export default function StaffLogin() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const role = localStorage.getItem('role')
    if (role === 'staff') {
      navigate('/staff')
    }
  }, [navigate])

  const handleLogin = () => {
    if (!keyword.trim()) {
      setError('请输入密钥')
      return
    }

    if (keyword.trim() === '爆炸') {
      const token = 'staff-token-' + Date.now()
      localStorage.setItem('token', token)
      localStorage.setItem('role', 'staff')
      navigate('/staff')
    } else {
      setError('密钥错误，请重试')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-4">
            工作人员登录
          </h1>
          <p className="text-gray-600">请输入密钥登录工作台</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-700 mb-2 font-medium">
                <Key className="inline mr-2 w-4 h-4" />
                密钥
              </label>
              <input
                type="password"
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value)
                  setError('')
                }}
                placeholder="请输入工作人员密钥"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 transition-colors bg-white"
                style={{ color: '#1f2937' }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleLogin()
                  }
                }}
              />
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
              <Shield className="inline w-5 h-5 mr-2" />
              登录工作台
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            提示：请联系管理员获取登录密钥
          </p>
        </div>
      </div>
    </div>
  )
}
