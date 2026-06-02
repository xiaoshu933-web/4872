import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Settings,
  Image,
  Type,
  BarChart3,
  LogOut,
  Upload,
  Trash2,
  Home as HomeIcon,
  Users,
  Gift,
  Plus,
  Edit2,
  Save,
  X,
  Palette,
} from 'lucide-react'

interface Prize {
  id: string
  name: string
  level: 'participation' | 'second' | 'first' | 'hidden'
  description: string
  probability: number
  stock: number
  status: 'active' | 'inactive'
}

const DEFAULT_CONFIG = {
  mainTitle: '日落后出发',
  activityTime: '夏季：6月15日至9月15日\n冬季：12月1日至次年3月10日',
  organizer: '大同市人民政府',
  undertaker: '大同市文化旅游投资集团有限公司、大同古城文化旅游发展有限公司',
  locationLine1: '大同市平城区',
  locationLine2: '大同古城',
  copyright: '地球明天爆炸',
  background1: '',
  background2: '',
  background3: '',
}

const CONFIG_KEY = 'night_festival_config'

function loadConfigFromStorage() {
  try {
    const saved = localStorage.getItem(CONFIG_KEY)
    if (saved) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(saved) }
    }
  } catch (e) {
    console.error('加载配置失败:', e)
  }
  try {
    const bg1 = localStorage.getItem('admin_background_1') || ''
    const bg2 = localStorage.getItem('admin_background_2') || ''
    const bg3 = localStorage.getItem('admin_background_3') || ''
    const content = localStorage.getItem('admin_content')
    if (content) {
      try {
        const parsedContent = JSON.parse(content)
        return { ...DEFAULT_CONFIG, ...parsedContent, background1: bg1, background2: bg2, background3: bg3 }
      } catch {}
    }
    return { ...DEFAULT_CONFIG, background1: bg1, background2: bg2, background3: bg3 }
  } catch {
    return DEFAULT_CONFIG
  }
  return DEFAULT_CONFIG
}

function saveConfigToStorage(config: typeof DEFAULT_CONFIG) {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
    return true
  } catch (e) {
    console.error('保存配置失败:', e)
    alert('保存失败：图片可能太大，请使用较小的图片或使用图片URL')
    return false
  }
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('content')
  const [config, setConfig] = useState(DEFAULT_CONFIG)

  useEffect(() => {
    setConfig(loadConfigFromStorage())
  }, [])

  const [prizes, setPrizes] = useState<Prize[]>([
    { id: '1', name: '优惠券', level: 'participation', description: '合作商户优惠券', probability: 80, stock: 100, status: 'active' },
    { id: '2', name: '文创纪念品', level: 'participation', description: '北魏文化纪念品', probability: 15, stock: 50, status: 'active' },
    { id: '3', name: '饮品代金券', level: 'participation', description: '古城饮品店代金券', probability: 5, stock: 30, status: 'active' },
    { id: '4', name: '景区门票', level: 'second', description: '大同古城景区门票一张', probability: 8, stock: 20, status: 'active' },
    { id: '5', name: '汉服体验', level: 'second', description: '汉服体验一小时', probability: 2, stock: 10, status: 'active' },
    { id: '6', name: '民宿住宿券', level: 'first', description: '合作民宿免费住宿一晚', probability: 1, stock: 5, status: 'active' },
    { id: '7', name: '隐藏大奖', level: 'hidden', description: '云阙景观大床房住宿券', probability: 0.1, stock: 1, status: 'active' },
  ])

  const [editingPrize, setEditingPrize] = useState<Prize | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const backgrounds = [
    { index: 1, url: config.background1 },
    { index: 2, url: config.background2 },
    { index: 3, url: config.background3 },
  ]

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      alert('图片过大，请使用 2MB 以下的图片')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const url = event.target?.result as string
      const bgKey = `background${index}` as keyof typeof DEFAULT_CONFIG
      const newConfig = { ...config, [bgKey]: url }
      setConfig(newConfig)
      saveConfigToStorage(newConfig)
    }
    reader.readAsDataURL(file)
  }

  const handleUrlInput = (index: number, url: string) => {
    const bgKey = `background${index}` as keyof typeof DEFAULT_CONFIG
    const newConfig = { ...config, [bgKey]: url }
    setConfig(newConfig)
    saveConfigToStorage(newConfig)
  }

  const clearBackground = (index: number) => {
    const bgKey = `background${index}` as keyof typeof DEFAULT_CONFIG
    const newConfig = { ...config, [bgKey]: '' }
    setConfig(newConfig)
    saveConfigToStorage(newConfig)
  }

  const handleSaveContent = () => {
    if (saveConfigToStorage(config)) {
      alert('保存成功！请刷新首页查看效果')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('userId')
    navigate('/')
  }

  const handleAddPrize = () => {
    const newPrize: Prize = {
      id: Date.now().toString(),
      name: '',
      level: 'participation',
      description: '',
      probability: 10,
      stock: 10,
      status: 'active',
    }
    setEditingPrize(newPrize)
    setShowAddModal(true)
  }

  const handleSavePrize = () => {
    if (!editingPrize) return

    if (!editingPrize.name || !editingPrize.description) {
      alert('请填写奖品名称和描述')
      return
    }

    setPrizes(prizes.map(p => p.id === editingPrize.id ? editingPrize : p))
    setShowAddModal(false)
    setEditingPrize(null)
    alert('奖品保存成功！')
  }

  const handleDeletePrize = (id: string) => {
    if (confirm('确定删除该奖品吗？')) {
      setPrizes(prizes.filter(p => p.id !== id))
    }
  }

  const handleExportData = (type: string) => {
    const data = {
      users: [
        { id: '1', phone: '13800138000', name: '张三', role: '游客', registerTime: '2024-06-01 10:30' },
        { id: '2', phone: '13900139000', name: '李四', role: '游客', registerTime: '2024-06-01 11:15' },
        { id: '3', phone: '13700137000', name: '王五', role: '商户', registerTime: '2024-06-02 09:00' },
      ],
      lotteryRecords: [
        { id: '1', phone: '13800138000', prize: '优惠券', drawTime: '2024-06-01 12:00', status: '已核销' },
        { id: '2', phone: '13800138000', prize: '文创纪念品', drawTime: '2024-06-01 14:30', status: '待核销' },
        { id: '3', phone: '13900139000', prize: '景区门票', drawTime: '2024-06-01 15:00', status: '待核销' },
      ],
      merchants: [
        { id: '1', name: '商户A', contact: '张先生', phone: '13700137000', status: '已审核', applyTime: '2024-06-02 09:00' },
        { id: '2', name: '商户B', contact: '李女士', phone: '13600136000', status: '待审核', applyTime: '2024-06-03 10:00' },
      ],
    }

    const csvContent = [
      `数据类型,${type}`,
      `导出时间,${new Date().toLocaleString('zh-CN')}`,
      '',
      ...data[type as keyof typeof data].map((item: any) => Object.values(item).map(v => `"${v}"`).join(','))
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${type}_data.xlsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    alert(`Excel已导出：${type}_data.xlsx`)
  }

  const getLevelText = (level: string) => {
    const map: Record<string, string> = {
      participation: '参与奖',
      second: '二等奖',
      first: '一等奖',
      hidden: '隐藏大奖',
    }
    return map[level] || level
  }

  const getLevelColor = (level: string) => {
    const map: Record<string, string> = {
      participation: 'bg-gray-100 text-gray-700',
      second: 'bg-blue-100 text-blue-700',
      first: 'bg-yellow-100 text-yellow-700',
      hidden: 'bg-purple-100 text-purple-700',
    }
    return map[level] || 'bg-gray-100 text-gray-700'
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
            <h1 className="text-xl font-serif font-bold text-gray-800 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              管理后台
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-gray-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            退出登录
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 flex">
        <aside className="w-64 mr-8">
          <nav className="bg-white rounded-xl shadow-sm p-4 space-y-1">
            {[
              { id: 'content', icon: Type, label: '内容管理' },
              { id: 'background', icon: Image, label: '背景设置' },
              { id: 'prizes', icon: Gift, label: '奖品管理' },
              { id: 'stats', icon: BarChart3, label: '数据统计' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1">
          {activeTab === 'content' && (
            <div className="max-w-4xl">
              <div className="mb-8">
                <h2 className="text-2xl font-serif font-bold mb-2 text-gray-800">
                  内容管理
                </h2>
                <p className="text-gray-600">配置首页展示内容</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
                <div className="flex items-center mb-6">
                  <Type className="w-6 h-6 text-gray-700 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-800">文字内容</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-medium">
                      主标题
                    </label>
                    <input
                      type="text"
                      value={config.mainTitle}
                      onChange={(e) =>
                        setConfig({ ...config, mainTitle: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 transition-colors bg-white"
                      style={{ color: '#1f2937' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-medium">
                      活动地点（第一行）
                    </label>
                    <input
                      type="text"
                      value={config.locationLine1}
                      onChange={(e) =>
                        setConfig({ ...config, locationLine1: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 transition-colors bg-white"
                      style={{ color: '#1f2937' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-medium">
                      活动地点（第二行）
                    </label>
                    <input
                      type="text"
                      value={config.locationLine2}
                      onChange={(e) =>
                        setConfig({ ...config, locationLine2: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 transition-colors bg-white"
                      style={{ color: '#1f2937' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-medium">
                      活动时间
                    </label>
                    <textarea
                      value={config.activityTime}
                      onChange={(e) =>
                        setConfig({ ...config, activityTime: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 transition-colors bg-white resize-none"
                      style={{ color: '#1f2937' }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      每行一个时间段，例如：夏季：6月15日至9月15日
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-medium">
                      主办单位
                    </label>
                    <input
                      type="text"
                      value={config.organizer}
                      onChange={(e) =>
                        setConfig({ ...config, organizer: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 transition-colors bg-white"
                      style={{ color: '#1f2937' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-medium">
                      承办单位
                    </label>
                    <textarea
                      value={config.undertaker}
                      onChange={(e) =>
                        setConfig({ ...config, undertaker: e.target.value })
                      }
                      rows={2}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 transition-colors bg-white resize-none"
                      style={{ color: '#1f2937' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2 font-medium">
                      版权信息
                    </label>
                    <input
                      type="text"
                      value={config.copyright}
                      onChange={(e) =>
                        setConfig({ ...config, copyright: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 transition-colors bg-white"
                      style={{ color: '#1f2937' }}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveContent}
                className="w-full bg-gray-800 text-white py-4 rounded-lg hover:bg-gray-700 transition-colors font-medium text-lg"
              >
                保存配置
              </button>
            </div>
          )}

          {activeTab === 'background' && (
            <div className="max-w-4xl">
              <div className="mb-8">
                <h2 className="text-2xl font-serif font-bold mb-2 text-gray-800">
                  背景设置
                </h2>
                <p className="text-gray-600">配置首页轮播背景图片（最多3张）</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
                <div className="flex items-center mb-6">
                  <Image className="w-6 h-6 text-gray-700 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-800">轮播背景图片</h3>
                </div>

                <div className="space-y-6">
                  {backgrounds.map((bg) => (
                    <div key={bg.index} className="border border-gray-200 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-800">背景图片 {bg.index}</h4>
                        {bg.url && (
                          <button
                            onClick={() => clearBackground(bg.index)}
                            className="flex items-center text-red-500 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            删除
                          </button>
                        )}
                      </div>

                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:border-gray-500 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(bg.index, e)}
                          className="hidden"
                          id={`image-upload-${bg.index}`}
                        />
                        <label
                          htmlFor={`image-upload-${bg.index}`}
                          className="cursor-pointer"
                        >
                          <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                          <p className="text-gray-700 mb-1">
                            {bg.url ? '点击更换图片' : '点击上传图片'}
                          </p>
                          <p className="text-xs text-gray-500">
                            支持 JPG、PNG、GIF 格式，建议尺寸 1920x1080，单张不超过 2MB
                          </p>
                        </label>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm text-gray-700 mb-2 font-medium">
                          或输入图片URL
                        </label>
                        <input
                          type="text"
                          value={bg.url}
                          onChange={(e) => handleUrlInput(bg.index, e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 transition-colors bg-white"
                          style={{ color: '#1f2937' }}
                        />
                      </div>

                      {bg.url && (
                        <div className="mt-4">
                          <label className="block text-sm text-gray-700 mb-2 font-medium">
                            预览
                          </label>
                          <div className="relative rounded-lg overflow-hidden shadow-md">
                            <img
                              src={bg.url}
                              alt={`背景 ${bg.index} 预览`}
                              className="w-full h-48 object-cover"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-sm text-blue-700">
                      <strong>提示：</strong>上传2张或以上图片后，首页会自动开启轮播效果，
                      每5秒自动切换一次，也可以点击底部小圆点手动切换。配置会自动保存。
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
                <div className="flex items-center mb-6">
                  <Palette className="w-6 h-6 text-gray-700 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-800">纯色背景备选</h3>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  点击下方颜色可将其设为背景1（如果想使用纯色背景）
                </p>

                <div className="grid grid-cols-8 gap-3">
                  {[
                    '#1a1a2e',
                    '#16213e',
                    '#0f3460',
                    '#2c3e50',
                    '#34495e',
                    '#7f8c8d',
                    '#95a5a6',
                    '#bdc3c7',
                    '#c0392b',
                    '#e74c3c',
                    '#d35400',
                    '#e67e22',
                    '#f39c12',
                    '#27ae60',
                    '#16a085',
                    '#2980b9',
                  ].map((color) => (
                    <button
                      key={color}
                      onClick={() => handleUrlInput(1, color)}
                      className="w-full aspect-square rounded-lg shadow-sm hover:scale-105 transition-transform border-2 border-gray-200"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleSaveContent}
                className="w-full bg-gray-800 text-white py-4 rounded-lg hover:bg-gray-700 transition-colors font-medium text-lg"
              >
                保存配置
              </button>
            </div>
          )}

          {activeTab === 'prizes' && (
            <div>
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-serif font-bold mb-2 text-gray-800">
                    奖品管理
                  </h2>
                  <p className="text-gray-600">管理抽奖奖品配置</p>
                </div>
                <button
                  onClick={handleAddPrize}
                  className="flex items-center space-x-2 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>添加奖品</span>
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">奖品名称</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">等级</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">描述</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">概率(%)</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">库存</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">状态</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {prizes.map((prize) => (
                      <tr key={prize.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-800">{prize.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(prize.level)}`}>
                            {getLevelText(prize.level)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-600">{prize.description}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-gray-800">{prize.probability}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={prize.stock > 10 ? 'text-green-600' : prize.stock > 0 ? 'text-yellow-600' : 'text-red-600'}>
                            {prize.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => {
                              const newStatus = prize.status === 'active' ? 'inactive' : 'active'
                              setPrizes(prizes.map(p => p.id === prize.id ? { ...p, status: newStatus as 'active' | 'inactive' } : p))
                            }}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${prize.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                          >
                            {prize.status === 'active' ? '启用' : '禁用'}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => {
                                setEditingPrize(prize)
                                setShowAddModal(true)
                              }}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="编辑"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePrize(prize.id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                              title="删除"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-serif font-bold mb-2 text-gray-800">
                  数据统计
                </h2>
                <p className="text-gray-600">活动数据概览</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  { label: '总参与人数', value: '12,345', icon: Users },
                  { label: '总抽奖次数', value: '45,678', icon: Gift },
                  { label: '总核销次数', value: '1,234', icon: BarChart3 },
                ].map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <stat.icon className="w-8 h-8 text-gray-700" />
                    </div>
                    <p className="text-4xl font-bold text-gray-800 mb-2">{stat.value}</p>
                    <p className="text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl shadow-sm p-8">
                <h3 className="text-xl font-semibold mb-6 text-gray-800">数据导出</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => handleExportData('users')}
                    className="border-2 border-gray-300 text-gray-800 py-4 rounded-lg hover:bg-gray-50 hover:border-gray-500 transition-colors font-medium"
                  >
                    导出用户数据
                  </button>
                  <button
                    onClick={() => handleExportData('lotteryRecords')}
                    className="border-2 border-gray-300 text-gray-800 py-4 rounded-lg hover:bg-gray-50 hover:border-gray-500 transition-colors font-medium"
                  >
                    导出抽奖记录
                  </button>
                  <button
                    onClick={() => handleExportData('merchants')}
                    className="border-2 border-gray-300 text-gray-800 py-4 rounded-lg hover:bg-gray-50 hover:border-gray-500 transition-colors font-medium"
                  >
                    导出商家数据
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {showAddModal && editingPrize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                {editingPrize.id ? '编辑奖品' : '添加奖品'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingPrize(null)
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">奖品名称 *</label>
                <input
                  type="text"
                  value={editingPrize.name}
                  onChange={(e) => setEditingPrize({ ...editingPrize, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600"
                  style={{ color: '#1f2937' }}
                  placeholder="请输入奖品名称"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">奖品等级</label>
                <select
                  value={editingPrize.level}
                  onChange={(e) => setEditingPrize({ ...editingPrize, level: e.target.value as Prize['level'] })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600"
                >
                  <option value="participation">参与奖</option>
                  <option value="second">二等奖</option>
                  <option value="first">一等奖</option>
                  <option value="hidden">隐藏大奖</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">奖品描述 *</label>
                <textarea
                  value={editingPrize.description}
                  onChange={(e) => setEditingPrize({ ...editingPrize, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 resize-none"
                  style={{ color: '#1f2937' }}
                  placeholder="请输入奖品描述"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">中奖概率 (%)</label>
                <input
                  type="number"
                  value={editingPrize.probability}
                  onChange={(e) => setEditingPrize({ ...editingPrize, probability: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600"
                  style={{ color: '#1f2937' }}
                  placeholder="0-100"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">库存数量</label>
                <input
                  type="number"
                  value={editingPrize.stock}
                  onChange={(e) => setEditingPrize({ ...editingPrize, stock: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600"
                  style={{ color: '#1f2937' }}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingPrize.status === 'active'}
                    onChange={(e) => setEditingPrize({ ...editingPrize, status: e.target.checked ? 'active' : 'inactive' })}
                    className="mr-3 w-5 h-5"
                  />
                  <span className="text-gray-700">启用奖品</span>
                </label>
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingPrize(null)
                }}
                className="flex-1 border border-gray-300 text-gray-800 py-3 rounded-lg hover:bg-gray-100"
              >
                取消
              </button>
              <button
                onClick={handleSavePrize}
                className="flex-1 bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-700 flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>保存</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
