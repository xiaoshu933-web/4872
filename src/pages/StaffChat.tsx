import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Scan,
  MessageCircle,
  Send,
  Image,
  Home as HomeIcon,
  LogOut,
  MoreVertical,
  Phone,
  User,
  RefreshCw,
} from 'lucide-react'

interface Message {
  id: string
  sender: 'visitor' | 'staff'
  content: string
  timestamp: string
  visitorId: string
}

interface Visitor {
  id: string
  name: string
  phone: string
  avatar: string
  lastMessage: string
  lastTime: string
  unread: number
}

export default function StaffChat() {
  const navigate = useNavigate()
  const [activeMenu, setActiveMenu] = useState('chat')
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: '数据看板', path: '/staff/dashboard' },
    { id: 'verify', icon: Scan, label: '核销功能', path: '/staff/verify' },
    { id: 'chat', icon: MessageCircle, label: '客服后台', path: '/staff/chat' },
  ]

  // 加载游客列表
  const loadVisitors = () => {
    const savedVisitors = localStorage.getItem('staff_visitors')
    if (savedVisitors) {
      const parsedVisitors = JSON.parse(savedVisitors)
      setVisitors(parsedVisitors)
    }
  }

  useEffect(() => {
    loadVisitors()
    // 每秒刷新游客列表
    const timer = setInterval(loadVisitors, 1000)
    return () => clearInterval(timer)
  }, [])

  // 加载选中游客的消息
  useEffect(() => {
    if (selectedVisitor) {
      const savedMessages = localStorage.getItem(`chat_messages_${selectedVisitor.id}`)
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages))
      } else {
        setMessages([])
      }
    }
  }, [selectedVisitor, refreshKey])

  // 每秒检查消息更新
  useEffect(() => {
    if (selectedVisitor) {
      const timer = setInterval(() => {
        setRefreshKey(k => k + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [selectedVisitor])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!inputMessage.trim() || !selectedVisitor) return

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'staff',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      visitorId: selectedVisitor.id,
    }

    // 保存消息到 localStorage
    const savedMessages = localStorage.getItem(`chat_messages_${selectedVisitor.id}`)
    const currentMessages: Message[] = savedMessages ? JSON.parse(savedMessages) : []
    const updatedMessages = [...currentMessages, newMessage]
    localStorage.setItem(`chat_messages_${selectedVisitor.id}`, JSON.stringify(updatedMessages))

    // 更新消息列表显示
    setMessages(updatedMessages)
    setInputMessage('')

    // 更新游客列表中的最后消息
    const savedVisitors = localStorage.getItem('staff_visitors')
    if (savedVisitors) {
      const visitorsList = JSON.parse(savedVisitors)
      const updatedVisitors = visitorsList.map((v: Visitor) =>
        v.id === selectedVisitor.id
          ? { ...v, lastMessage: inputMessage, lastTime: '刚刚' }
          : v
      )
      localStorage.setItem('staff_visitors', JSON.stringify(updatedVisitors))
      setVisitors(updatedVisitors)
    }
  }

  const handleSelectVisitor = (visitor: Visitor) => {
    setSelectedVisitor(visitor)
    // 清除未读标记
    const savedVisitors = localStorage.getItem('staff_visitors')
    if (savedVisitors) {
      const visitorsList = JSON.parse(savedVisitors)
      const updatedVisitors = visitorsList.map((v: Visitor) =>
        v.id === visitor.id ? { ...v, unread: 0 } : v
      )
      localStorage.setItem('staff_visitors', JSON.stringify(updatedVisitors))
      setVisitors(updatedVisitors)
    }
    localStorage.removeItem(`staff_unread_${visitor.id}`)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('userId')
    navigate('/')
  }

  const handleRefresh = () => {
    loadVisitors()
    if (selectedVisitor) {
      const savedMessages = localStorage.getItem(`chat_messages_${selectedVisitor.id}`)
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages))
      }
    }
    setRefreshKey(k => k + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="flex items-center text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              返回首页
            </Link>
            <h1 className="text-xl font-serif font-bold text-gray-800">工作人员后台</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-gray-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              退出登录
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 flex">
        <aside className="w-64 mr-8">
          <nav className="bg-white rounded-xl shadow-sm p-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setActiveMenu(item.id)}
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

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
            <h4 className="font-semibold text-blue-800 mb-2 text-sm">使用说明</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• 左侧显示正在咨询的游客</li>
              <li>• 点击游客查看对话</li>
              <li>• 在下方输入框回复消息</li>
              <li>• 游客发送消息会自动显示</li>
            </ul>
          </div>
        </aside>

        <main className="flex-1 flex">
          <div className="w-80 bg-white rounded-xl shadow-sm mr-6 flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">客服消息</h3>
              <span className="text-sm text-gray-500">
                {visitors.length} 位用户
              </span>
            </div>

            <div className="flex-1 overflow-y-auto">
              {visitors.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">暂无游客咨询</p>
                  <p className="text-xs mt-1">等待游客发送消息...</p>
                </div>
              ) : (
                visitors.map((visitor) => (
                  <button
                    key={visitor.id}
                    onClick={() => handleSelectVisitor(visitor)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3 border-b border-gray-100 ${
                      selectedVisitor?.id === visitor.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800 truncate">{visitor.name}</span>
                        <span className="text-xs text-gray-400">{visitor.lastTime}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate mt-1">
                        {visitor.lastMessage}
                      </p>
                    </div>
                    {visitor.unread > 0 && (
                      <span className="w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {visitor.unread}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="flex-1 bg-white rounded-xl shadow-sm flex flex-col">
            {selectedVisitor ? (
              <>
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{selectedVisitor.name}</h4>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {selectedVisitor.phone}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'staff' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-md px-4 py-3 rounded-lg ${
                          message.sender === 'staff'
                            ? 'bg-gray-800 text-white rounded-br-none'
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                        }`}
                      >
                        <p>{message.content}</p>
                        <span
                          className={`text-xs mt-1 block ${
                            message.sender === 'staff' ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          {message.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Image className="w-5 h-5 text-gray-600" />
                    </button>
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="输入回复消息..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600"
                      style={{ color: '#1f2937' }}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!inputMessage.trim()}
                      className={`p-3 rounded-lg transition-colors ${
                        inputMessage.trim()
                          ? 'bg-gray-800 text-white hover:bg-gray-700'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">选择一个用户开始聊天</p>
                  <p className="text-sm text-gray-400 mt-2">点击左侧列表中的游客查看对话</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
