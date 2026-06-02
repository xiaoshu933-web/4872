import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Send, Image, Home as HomeIcon, LogOut, X, User } from 'lucide-react'

interface Message {
  id: string
  sender: 'visitor' | 'staff'
  content: string
  timestamp: string
  visitorId: string
}

export default function Chat() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isStaffOnline, setIsStaffOnline] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const visitorId = localStorage.getItem('visitorPhone') || 'unknown'
  const visitorKey = `visitor_${visitorId}`

  useEffect(() => {
    const savedMessages = localStorage.getItem(`chat_messages_${visitorKey}`)
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    } else {
      const initialMessages: Message[] = [
        {
          id: '1',
          sender: 'staff',
          content: '您好！欢迎咨询"四八七十二·北魏夜游生活节"活动，有什么可以帮助您的？',
          timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          visitorId: visitorKey,
        },
      ]
      setMessages(initialMessages)
      localStorage.setItem(`chat_messages_${visitorKey}`, JSON.stringify(initialMessages))
    }
  }, [visitorKey])

  useEffect(() => {
    const timer = setInterval(() => {
      const savedMessages = localStorage.getItem(`chat_messages_${visitorKey}`)
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages)
        if (parsedMessages.length !== messages.length) {
          setMessages(parsedMessages)
        }
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [visitorKey, messages.length])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => {
        setIsTyping(false)
        const replies = [
          '好的，我了解了您的问题，正在为您查询...',
          '感谢您的反馈，我们会尽快处理！',
          '这个问题我需要向相关部门确认，请稍等。',
          '明白了，我来帮您解答这个问题。',
        ]
        const reply = replies[Math.floor(Math.random() * replies.length)]
        const newMessage: Message = {
          id: Date.now().toString(),
          sender: 'staff',
          content: reply,
          timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          visitorId: visitorKey,
        }
        const updatedMessages = [...messages, newMessage]
        setMessages(updatedMessages)
        localStorage.setItem(`chat_messages_${visitorKey}`, JSON.stringify(updatedMessages))
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isTyping, messages, visitorKey])

  const handleSend = () => {
    if (!inputMessage.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'visitor',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      visitorId: visitorKey,
    }

    const updatedMessages = [...messages, newMessage]
    setMessages(updatedMessages)
    setInputMessage('')
    localStorage.setItem(`chat_messages_${visitorKey}`, JSON.stringify(updatedMessages))

    // 更新游客列表
    const now = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    const staffVisitors = localStorage.getItem('staff_visitors')
    const visitorsList = staffVisitors ? JSON.parse(staffVisitors) : []

    if (!visitorsList.find((v: any) => v.id === visitorKey)) {
      // 新游客
      visitorsList.push({
        id: visitorKey,
        name: `游客${visitorId.slice(-4)}`,
        phone: visitorId,
        avatar: visitorId.slice(-1).toUpperCase(),
        lastMessage: inputMessage,
        lastTime: now,
        unread: 0,
        hasNewMessage: true,
      })
    } else {
      // 更新现有游客
      visitorsList.forEach((v: any) => {
        if (v.id === visitorKey) {
          v.lastMessage = inputMessage
          v.lastTime = now
          v.hasNewMessage = true
        }
      })
    }
    localStorage.setItem('staff_visitors', JSON.stringify(visitorsList))

    // 标记有新消息
    localStorage.setItem(`visitor_has_new_message_${visitorKey}`, 'true')
    localStorage.setItem(`staff_new_message_time_${visitorKey}`, now.toString())

    setIsTyping(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('userId')
    localStorage.removeItem('visitorPhone')
    localStorage.removeItem('merchantPhone')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              <HomeIcon className="w-5 h-5 mr-2" />
              返回首页
            </Link>
            <h1 className="text-xl font-serif font-bold text-gray-800">在线客服</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
            >
              退出登录
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm flex flex-col h-[calc(100vh-180px)]">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">客服小助手</h4>
                <div className="flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-2 ${isStaffOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                  <span className="text-sm text-gray-500">{isStaffOnline ? '在线' : '离线'}</span>
                </div>
              </div>
            </div>
            <Link to="/my">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'staff' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-md px-4 py-3 rounded-lg ${
                    message.sender === 'staff'
                      ? 'bg-gray-100 text-gray-800 rounded-bl-none'
                      : 'bg-gray-800 text-white rounded-br-none'
                  }`}
                >
                  <p>{message.content}</p>
                  <span
                    className={`text-xs mt-1 block ${
                      message.sender === 'staff' ? 'text-gray-500' : 'text-gray-400'
                    }`}
                  >
                    {message.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-3 rounded-lg rounded-bl-none">
                  <div className="flex space-x-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
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
                placeholder="输入消息..."
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 bg-white"
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
        </div>
      </main>
    </div>
  )
}
