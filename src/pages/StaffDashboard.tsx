import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Scan,
  MessageCircle,
  Gift,
  Users,
  Home as HomeIcon,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

export default function StaffDashboard() {
  const navigate = useNavigate()
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: '数据看板', path: '/staff/dashboard' },
    { id: 'verify', icon: Scan, label: '核销功能', path: '/staff/verify' },
    { id: 'chat', icon: MessageCircle, label: '客服后台', path: '/staff/chat' },
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('userId')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 md:space-x-6">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <Link
                to="/"
                className="flex items-center text-gray-700 hover:text-gray-900 transition-colors font-medium"
              >
                <HomeIcon className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">返回首页</span>
              </Link>
              <h1 className="text-lg md:text-xl font-serif font-bold text-gray-800">
                工作人员后台
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 md:px-4 md:py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-gray-700 text-sm"
            >
              <LogOut className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">退出登录</span>
            </button>
          </div>
        </div>
      </header>

      <div className="md:flex">
        <aside className={`md:w-64 ${showMobileMenu ? 'fixed inset-x-0 top-14 z-40 bg-white border-b border-gray-200' : 'hidden md:block'}`}>
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => {
                  setActiveMenu(item.id)
                  setShowMobileMenu(false)
                }}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeMenu === item.id
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 min-h-[calc(100vh-60px)]">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
            <div className="mb-4 md:mb-8">
              <h2 className="text-xl md:text-2xl font-serif font-bold mb-2 text-gray-800">数据看板</h2>
              <p className="text-gray-600">实时监控活动数据</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-4 md:mb-8">
              <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <Users className="w-8 h-8 md:w-10 md:h-10 text-gray-600" />
                  <span className="text-xl md:text-3xl font-bold text-gray-800">1,234</span>
                </div>
                <p className="text-sm md:text-base text-gray-600">参与游客数</p>
                <p className="text-xs md:text-sm text-green-600 mt-1 md:mt-2">+12% 较昨日</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <Gift className="w-8 h-8 md:w-10 md:h-10 text-gray-600" />
                  <span className="text-xl md:text-3xl font-bold text-gray-800">5,678</span>
                </div>
                <p className="text-sm md:text-base text-gray-600">抽奖总次数</p>
                <p className="text-xs md:text-sm text-green-600 mt-1 md:mt-2">+8% 较昨日</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <Users className="w-8 h-8 md:w-10 md:h-10 text-gray-600" />
                  <span className="text-xl md:text-3xl font-bold text-gray-800">89</span>
                </div>
                <p className="text-sm md:text-base text-gray-600">入驻商家数</p>
                <p className="text-xs md:text-sm text-yellow-600 mt-1 md:mt-2">待审核 3 家</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <Scan className="w-8 h-8 md:w-10 md:h-10 text-gray-600" />
                  <span className="text-xl md:text-3xl font-bold text-gray-800">456</span>
                </div>
                <p className="text-sm md:text-base text-gray-600">核销总数</p>
                <p className="text-xs md:text-sm text-green-600 mt-1 md:mt-2">今日 23 笔</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
              <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-800">中奖分布</h3>
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm md:text-base text-gray-700">参与奖</span>
                    <div className="flex items-center space-x-2 md:space-x-4">
                      <div className="w-24 md:w-48 h-3 md:h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gray-500"
                          style={{ width: '85%' }}
                        ></div>
                      </div>
                      <span className="font-bold text-gray-800 text-sm">85%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm md:text-base text-gray-700">二等奖</span>
                    <div className="flex items-center space-x-2 md:space-x-4">
                      <div className="w-24 md:w-48 h-3 md:h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: '10%' }}
                        ></div>
                      </div>
                      <span className="font-bold text-gray-800 text-sm">10%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm md:text-base text-gray-700">一等奖</span>
                    <div className="flex items-center space-x-2 md:space-x-4">
                      <div className="w-24 md:w-48 h-3 md:h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500"
                          style={{ width: '4%' }}
                        ></div>
                      </div>
                      <span className="font-bold text-gray-800 text-sm">4%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm md:text-base text-gray-700">隐藏大奖</span>
                    <div className="flex items-center space-x-2 md:space-x-4">
                      <div className="w-24 md:w-48 h-3 md:h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-500"
                          style={{ width: '1%' }}
                        ></div>
                      </div>
                      <span className="font-bold text-gray-800 text-sm">1%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-800">待审核商家</h3>
                <div className="space-y-3">
                  {[
                    { name: '北魏小吃店', type: '美食', time: '2小时前' },
                    { name: '古城文创坊', type: '文创', time: '4小时前' },
                    { name: '夜游咖啡馆', type: '饮品', time: '6小时前' },
                  ].map((merchant, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{merchant.name}</p>
                        <p className="text-xs md:text-sm text-gray-600">{merchant.type}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-500">{merchant.time}</span>
                        <Link
                          to="/staff/merchants"
                          className="block text-sm text-gray-700 hover:underline font-medium"
                        >
                          审核
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showMobileMenu && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setShowMobileMenu(false)}
        />
      )}
    </div>
  )
}
