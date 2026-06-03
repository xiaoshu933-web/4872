import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Phone, Gift, History, LogOut, CheckCircle, Clock, Edit2, Save, Home as HomeIcon } from 'lucide-react'

export default function MyPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'info' | 'prizes' | 'history'>('info')
  const [isEditing, setIsEditing] = useState(false)
  const [userInfo, setUserInfo] = useState({
    phone: '',
    name: '',
    idCard: '',
  })
  const [role, setRole] = useState('')
  const [records, setRecords] = useState<any[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userRole = localStorage.getItem('role')
    if (!token) {
      navigate('/')
      return
    }
    setRole(userRole || 'visitor')

    const phone = localStorage.getItem('visitorPhone') || localStorage.getItem('merchantPhone') || ''
    const savedInfo = localStorage.getItem('userInfo')
    const savedRecords = localStorage.getItem('lottery-records')

    if (savedInfo) {
      setUserInfo(JSON.parse(savedInfo))
    } else {
      setUserInfo({ phone, name: '', idCard: '' })
    }

    if (savedRecords) {
      setRecords(JSON.parse(savedRecords))
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('userId')
    localStorage.removeItem('visitorPhone')
    localStorage.removeItem('merchantPhone')
    localStorage.removeItem('lotteryCount')
    localStorage.removeItem('lottery-records')
    navigate('/')
  }

  const handleSaveInfo = () => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    setIsEditing(false)
    alert('保存成功！')
  }

  const unverifiedRecords = records.filter((r) => !r.isVerified)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              返回首页
            </Link>
            <h1 className="text-xl font-serif font-bold text-gray-800">个人中心</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            退出登录
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="w-10 h-10 text-gray-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-800">
                {userInfo.name || '用户'}
              </h2>
              <p className="text-gray-600 flex items-center mt-1">
                <Phone className="w-4 h-4 mr-1" />
                {userInfo.phone || '未绑定手机'}
              </p>
            </div>
            <div className="px-4 py-2 bg-gray-100 rounded-lg">
              <span className="text-gray-700 font-medium">
                {role === 'visitor' ? '游客' : role === 'merchant' ? '商户' : role === 'admin' ? '管理员' : '用户'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex space-x-4 mb-8 bg-white rounded-xl shadow-sm p-2">
          <button
            onClick={() => {
              setActiveTab('info')
              setIsEditing(false)
            }}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
              activeTab === 'info'
                ? 'bg-gray-800 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <User className="w-5 h-5" />
            <span>个人信息</span>
          </button>
          {role === 'visitor' && (
            <>
              <button
                onClick={() => setActiveTab('prizes')}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                  activeTab === 'prizes'
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Gift className="w-5 h-5" />
                <span>我的奖品</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                  activeTab === 'history'
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <History className="w-5 h-5" />
                <span>抽奖记录</span>
              </button>
            </>
          )}
        </div>

        {activeTab === 'info' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">个人信息</h3>
              {isEditing ? (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSaveInfo}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>保存</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors flex items-center space-x-2"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>编辑</span>
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2 font-medium">
                  手机号
                </label>
                <input
                  type="tel"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 transition-colors bg-white ${
                    isEditing ? '' : 'bg-gray-50'
                  }`}
                  style={{ color: '#1f2937' }}
                  placeholder="请输入手机号"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2 font-medium">
                  姓名
                </label>
                <input
                  type="text"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 transition-colors bg-white ${
                    isEditing ? '' : 'bg-gray-50'
                  }`}
                  style={{ color: '#1f2937' }}
                  placeholder="请输入姓名"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2 font-medium">
                  身份证号 *
                </label>
                <input
                  type="text"
                  value={userInfo.idCard}
                  onChange={(e) => setUserInfo({ ...userInfo, idCard: e.target.value })}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 transition-colors bg-white ${
                    isEditing ? '' : 'bg-gray-50'
                  }`}
                  style={{ color: '#1f2937' }}
                  placeholder="请输入身份证号"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2 font-medium">
                  账户类型
                </label>
                <div className="w-full px-4 py-3 bg-gray-50 rounded-lg border-2 border-gray-300">
                  <span className="text-gray-800 font-medium">
                    {role === 'visitor' ? '游客' : role === 'merchant' ? '商户' : role === 'admin' ? '管理员' : '用户'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'prizes' && (
          <div className="space-y-4">
            {unverifiedRecords.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Gift className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">暂无未核销奖品</p>
                <Link
                  to="/lottery"
                  className="inline-block mt-4 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  去抽奖
                </Link>
              </div>
            ) : (
              unverifiedRecords.map((record) => (
                <div key={record.id} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                          {record.prize?.level || '参与奖'}
                        </span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800">{record.prize?.name || record.prizeName || '未知奖品'}</h4>
                      <p className="text-gray-600 mt-1">{record.prize?.description || '暂无描述'}</p>
                      <div className="flex items-center mt-2 text-sm text-yellow-600">
                        <Clock className="w-4 h-4 mr-1" />
                        待核销
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">核销码</p>
                      <p className="text-xl font-mono font-bold text-gray-800 bg-gray-100 px-4 py-2 rounded-lg">
                        {record.verificationCode}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {records.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <History className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">暂无抽奖记录</p>
                <Link
                  to="/lottery"
                  className="inline-block mt-4 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  去抽奖
                </Link>
              </div>
            ) : (
              records.map((record) => (
                <div key={record.id} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          record.prize?.level === '二等奖' ? 'text-blue-600 bg-blue-50' : 
                          record.prize?.level === '一等奖' ? 'text-purple-600 bg-purple-50' :
                          record.prize?.level === '隐藏大奖' ? 'text-yellow-600 bg-yellow-50' :
                          'text-gray-600 bg-gray-100'
                        }`}>
                          {record.prize?.level || '参与奖'}
                        </span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800">{record.prize?.name || record.prizeName || '未知奖品'}</h4>
                      <p className="text-gray-600 mt-1">{record.prize?.description || '暂无描述'}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(record.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {record.isVerified ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-5 h-5 mr-1" />
                          <span className="text-sm font-medium">已核销</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-yellow-600">
                          <Clock className="w-5 h-5 mr-1" />
                          <span className="text-sm font-medium">待核销</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}
