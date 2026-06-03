import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { MessageCircle, Gift, Store, User, ChevronDown, Users, LogOut, Shield, Send as SendIcon } from 'lucide-react'
import { loadConfig, DEFAULT_CONFIG } from '@/utils/config'

interface ChatMessage {
  id: string
  content: string
  time: string
  isVisitor: boolean
}

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [showChat, setShowChat] = useState(false)
  const [showLoginDropdown, setShowLoginDropdown] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])

  useEffect(() => {
    if (chatMessages.length === 0) {
      const currentTime = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      setChatMessages([{
        id: '1',
        content: '您好！欢迎咨询"四八七十二·北魏夜游生活节"活动，有什么可以帮助您的？',
        time: currentTime,
        isVisitor: false,
      }])
    }
  }, [chatMessages.length])

  useEffect(() => {
    if (showChat && chatMessages.length > 0 && chatMessages[0].isVisitor === false) {
      const currentTime = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      setChatMessages((prev) => [{
        ...prev[0],
        time: currentTime,
      }, ...prev.slice(1)])
    }
  }, [showChat])
  const [chatInput, setChatInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = () => {
    if (!chatInput.trim()) return

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: chatInput,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      isVisitor: true,
    }

    setChatMessages([...chatMessages, newMessage])
    setChatInput('')
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      const replies = [
        '好的，我了解了您的问题，正在为您查询...',
        '感谢您的反馈，我们会尽快处理！',
        '这个问题我需要向相关部门确认，请稍等。',
        '明白了，我来帮您解答这个问题。',
        '请问还有什么需要帮助的吗？',
      ]
      const reply = replies[Math.floor(Math.random() * replies.length)]
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: reply,
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          isVisitor: false,
        },
      ])
    }, 1500)
  }

  useEffect(() => {
    const role = localStorage.getItem('role')
    setUserRole(role)
    let mounted = true
    loadConfig().then((cfg) => {
      if (mounted) setConfig(cfg)
    })
    return () => {
      mounted = false
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('userId')
    setUserRole(null)
    setShowUserDropdown(false)
    navigate('/')
  }

  const isHomePage = location.pathname === '/'

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <nav className={`fixed top-0 left-0 right-0 z-50 ${
        isHomePage ? 'bg-transparent' : 'bg-white border-b border-gray-200'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20 pt-4">
            <Link to="/" className="flex items-center space-x-2">
              <span className={`text-3xl md:text-4xl font-serif font-bold ${
                isHomePage ? 'text-white' : 'text-gray-800'
              }`}>四八七十二</span>
            </Link>

            <div className="flex items-center space-x-2">
              {!userRole ? (
                <div className="relative">
                  <button
                    onClick={() => setShowLoginDropdown(!showLoginDropdown)}
                    className={`flex items-center space-x-1 px-4 py-2 rounded transition-colors ${
                      isHomePage
                        ? 'bg-white/20 hover:bg-white/30 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    <span>登录</span>
                    <ChevronDown size={16} />
                  </button>

                  {showLoginDropdown && (
                    <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl py-2 min-w-[160px] border border-gray-200">
                      <Link
                        to="/visitor/login"
                        onClick={() => setShowLoginDropdown(false)}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 text-gray-800 transition-colors w-full"
                      >
                        <Gift size={18} />
                        <span>游客登录</span>
                      </Link>
                      <Link
                        to="/merchant/login"
                        onClick={() => setShowLoginDropdown(false)}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 text-gray-800 transition-colors w-full"
                      >
                        <Store size={18} />
                        <span>商户登录</span>
                      </Link>
                      <Link
                        to="/staff/login"
                        onClick={() => setShowLoginDropdown(false)}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 text-gray-800 transition-colors w-full"
                      >
                        <Users size={18} />
                        <span>工作人员登录</span>
                      </Link>
                      <div className="border-t border-gray-200 my-1"></div>
                      <Link
                        to="/admin/login"
                        onClick={() => setShowLoginDropdown(false)}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 text-gray-800 transition-colors w-full"
                      >
                        <Shield size={18} />
                        <span>管理人员登录</span>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded transition-colors ${
                      isHomePage
                        ? 'bg-white/20 hover:bg-white/30 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    <User size={20} />
                    <span>我的</span>
                    <ChevronDown size={16} />
                  </button>

                  {showUserDropdown && (
                    <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl py-2 min-w-[160px] border border-gray-200">
                      <Link
                        to="/my"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 text-gray-800 transition-colors w-full"
                      >
                        <User size={18} />
                        <span>个人中心</span>
                      </Link>
                      {userRole === 'visitor' && (
                        <Link
                          to="/lottery"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 text-gray-800 transition-colors w-full"
                        >
                          <Gift size={18} />
                          <span>抽奖中心</span>
                        </Link>
                      )}
                      {userRole === 'merchant' && (
                        <Link
                          to="/merchant"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 text-gray-800 transition-colors w-full"
                        >
                          <Store size={18} />
                          <span>申报中心</span>
                        </Link>
                      )}
                      {userRole === 'staff' && (
                        <Link
                          to="/staff"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 text-gray-800 transition-colors w-full"
                        >
                          <Users size={18} />
                          <span>工作台</span>
                        </Link>
                      )}
                      {userRole === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 text-gray-800 transition-colors w-full"
                        >
                          <Shield size={18} />
                          <span>管理后台</span>
                        </Link>
                      )}
                      <div className="border-t border-gray-200 my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 text-red-500 transition-colors w-full text-left"
                      >
                        <LogOut size={18} />
                        <span>退出登录</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => setShowChat(true)}
                className={`px-4 py-2 rounded transition-colors ${
                  isHomePage
                    ? 'bg-white/90 text-gray-800 hover:bg-white shadow-md'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                <span>客服</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <span>📍</span>
              <span>大同古城</span>
            </div>

            <div className="text-sm text-gray-500 space-y-1">
              <p>主办单位：大同市人民政府</p>
              <p>承办单位：大同市文化旅游投资集团有限公司、大同古城文化旅游发展有限公司</p>
            </div>

            <div className="text-xs text-gray-400">
              © {new Date().getFullYear()} {config.copyright} · 四八七十二·北魏夜游生活节
            </div>
          </div>
        </div>
      </footer>

      {showChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl w-full max-w-2xl h-[600px] mx-4 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">在线客服</h3>
                  <div className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    <span className="text-xs text-gray-500">在线</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors text-2xl"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isVisitor ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`px-4 py-3 rounded-lg max-w-md ${
                      msg.isVisitor
                        ? 'bg-gray-800 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <span className={`text-xs mt-1 block ${msg.isVisitor ? 'text-gray-400' : 'text-gray-500'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-3 rounded-lg rounded-bl-none">
                    <div className="flex space-x-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="输入消息..."
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600"
                  style={{ color: '#1f2937' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim()}
                  className={`p-3 rounded-lg transition-colors ${
                    chatInput.trim()
                      ? 'bg-gray-800 text-white hover:bg-gray-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <SendIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
