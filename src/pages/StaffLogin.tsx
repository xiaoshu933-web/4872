import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { QrCode, Users } from 'lucide-react'

export default function StaffLogin() {
  const navigate = useNavigate()
  const [qrId, setQrId] = useState('')
  const [expireTime, setExpireTime] = useState(30)

  useEffect(() => {
    generateQR()

    const interval = setInterval(() => {
      setExpireTime((prev) => {
        if (prev <= 1) {
          generateQR()
          return 30
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const generateQR = () => {
    setQrId('STAFF-QR-' + Date.now())
    setExpireTime(30)
  }

  const handleLogin = () => {
    const token = 'staff-token-' + Date.now()
    localStorage.setItem('token', token)
    localStorage.setItem('role', 'staff')
    navigate('/staff')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
            <QrCode className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-gray-800 mb-4">
            工作人员登录
          </h1>
          <p className="text-gray-600">演示模式 - 点击按钮即可登录</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="bg-gray-50 rounded-xl p-8 mb-6 inline-block">
            <div className="w-64 h-64 flex flex-col items-center justify-center">
              <div className="border-4 border-gray-800 rounded-lg p-6 mb-4">
                <div className="grid grid-cols-8 gap-1">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 ${
                        Math.random() > 0.5 ? 'bg-gray-800' : 'bg-white'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="text-xs text-gray-500 font-mono mt-2">
                {qrId}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-gray-800 rounded-full animate-pulse"></div>
              <span className="text-gray-600">
                演示模式：二维码每30秒自动刷新
              </span>
            </div>
            <p className="text-sm text-gray-500">
              二维码 {expireTime} 秒后刷新
            </p>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-gray-800 text-white py-4 rounded-lg hover:bg-gray-700 transition-colors font-medium text-lg mb-4"
          >
            <Users className="inline w-5 h-5 mr-2" />
            确认登录（演示）
          </button>

          <button
            onClick={generateQR}
            className="w-full border border-gray-300 text-gray-800 py-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            刷新二维码
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            提示：这是演示环境，点击"确认登录（演示）"按钮即可进入工作台
          </p>
        </div>
      </div>
    </div>
  )
}
