import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Gift, Upload, Scan, Home as HomeIcon } from 'lucide-react'

export default function Lottery() {
  const navigate = useNavigate()
  const [showResultModal, setShowResultModal] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [drawCount, setDrawCount] = useState<{ remainingCount: number; totalCount: number }>({
    remainingCount: 0,
    totalCount: 0,
  })
  const [isDrawing, setIsDrawing] = useState(false)
  const [receiptForm, setReceiptForm] = useState({
    transactionId: '',
    platform: 'wechat' as 'wechat' | 'alipay',
  })
  const [visitorPhone, setVisitorPhone] = useState('')
  const [records, setRecords] = useState<any[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    if (!token || role !== 'visitor') {
      navigate('/visitor/login')
      return
    }

    const phone = localStorage.getItem('visitorPhone') || '游客'
    setVisitorPhone(phone)

    const savedCount = localStorage.getItem('lotteryCount')
    if (savedCount) {
      setDrawCount(JSON.parse(savedCount))
    }

    const savedRecords = localStorage.getItem('lotteryRecords')
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords))
    }
  }, [navigate])

  const updateDrawCount = (newCount: { remainingCount: number; totalCount: number }) => {
    setDrawCount(newCount)
    localStorage.setItem('lotteryCount', JSON.stringify(newCount))
  }

  const addRecord = (record: any) => {
    const newRecords = [record, ...records]
    setRecords(newRecords)
    localStorage.setItem('lotteryRecords', JSON.stringify(newRecords))
  }

  const handleDraw = () => {
    if (!drawCount || drawCount.remainingCount <= 0) {
      alert('没有抽奖次数，请先上传消费凭证')
      return
    }

    setIsDrawing(true)

    setTimeout(() => {
      const prizes = [
        { name: '优惠券', level: 'participation', description: '合作商户优惠券' },
        { name: '文创纪念品', level: 'participation', description: '北魏文化纪念品' },
        { name: '饮品代金券', level: 'participation', description: '古城饮品店代金券' },
        { name: '景区门票', level: 'second', description: '大同古城景区门票一张' },
        { name: '汉服体验', level: 'second', description: '汉服体验一小时' },
        { name: '民宿住宿券', level: 'first', description: '合作民宿免费住宿一晚' },
        { name: '隐藏大奖', level: 'hidden', description: '云阙景观大床房住宿券' },
      ]

      const random = Math.random()
      let selectedPrize

      if (random < 0.001) {
        selectedPrize = prizes[6]
      } else if (random < 0.03) {
        selectedPrize = prizes[5]
      } else if (random < 0.10) {
        selectedPrize = prizes[4]
      } else if (random < 0.20) {
        selectedPrize = prizes[3]
      } else {
        selectedPrize = prizes[Math.floor(Math.random() * 3)]
      }

      const verificationCode = 'LC' + Date.now().toString().slice(-8)

      const record = {
        id: Date.now().toString(),
        prize: selectedPrize,
        verificationCode,
        createdAt: new Date().toISOString(),
      }

      setResult(record)
      setShowResultModal(true)
      addRecord(record)

      const newCount = {
        remainingCount: drawCount.remainingCount - 1,
        totalCount: drawCount.totalCount,
      }
      updateDrawCount(newCount)

      setIsDrawing(false)
    }, 1500)
  }

  const handleUploadReceipt = () => {
    if (!receiptForm.transactionId) {
      alert('请输入交易单号')
      return
    }

    if (receiptForm.transactionId.length < 8) {
      alert('请输入有效的交易单号')
      return
    }

    const randomBonus = Math.floor(Math.random() * 3) + 1
    const currentRemaining = drawCount?.remainingCount || 0
    const currentTotal = drawCount?.totalCount || 0

    const newCount = {
      remainingCount: currentRemaining + randomBonus,
      totalCount: currentTotal + randomBonus,
    }

    updateDrawCount(newCount)
    setReceiptForm({ transactionId: '', platform: 'wechat' })
    alert(`消费凭证验证成功！获得 ${randomBonus} 次抽奖机会`)
  }

  const handleScanQR = () => {
    const randomBonus = 1
    const currentRemaining = drawCount?.remainingCount || 0
    const currentTotal = drawCount?.totalCount || 0

    const newCount = {
      remainingCount: currentRemaining + randomBonus,
      totalCount: currentTotal + randomBonus,
    }

    updateDrawCount(newCount)
    alert(`扫码成功！获得 ${randomBonus} 次额外抽奖机会`)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('userId')
    localStorage.removeItem('visitorPhone')
    navigate('/')
  }

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
            <h1 className="text-xl font-serif font-bold text-gray-800">抽奖中心</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{visitorPhone}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
            >
              退出登录
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
            <div className="text-5xl font-bold text-gray-800 mb-4">
              {drawCount?.remainingCount || 0}
            </div>
            <p className="text-gray-600 text-lg">剩余抽奖次数</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
            <div className="text-5xl font-bold text-gray-800 mb-4">
              {drawCount?.totalCount || 0}
            </div>
            <p className="text-gray-600 text-lg">累计获得次数</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 max-w-lg mx-auto mb-8 border border-gray-100">
          <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">立即抽奖</h3>

          <button
            onClick={handleDraw}
            disabled={isDrawing || !drawCount || drawCount.remainingCount <= 0}
            className={`w-full py-6 rounded-lg font-bold text-2xl transition-all ${
              isDrawing
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : drawCount && drawCount.remainingCount > 0
                ? 'bg-gray-800 text-white hover:bg-gray-700 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isDrawing ? '抽奖中...' : '点击抽奖'}
          </button>

          {(!drawCount || drawCount.remainingCount <= 0) && !isDrawing && (
            <p className="text-center text-sm text-gray-500 mt-4">
              没有抽奖次数？请先上传消费凭证
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <Upload className="w-8 h-8 text-gray-700 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">上传消费凭证</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-700 mb-2 font-medium">
                  支付平台
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="platform"
                      value="wechat"
                      checked={receiptForm.platform === 'wechat'}
                      onChange={(e) =>
                        setReceiptForm({ ...receiptForm, platform: 'wechat' })
                      }
                      className="mr-2"
                    />
                    <span className="text-gray-800">微信支付</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="platform"
                      value="alipay"
                      checked={receiptForm.platform === 'alipay'}
                      onChange={(e) =>
                        setReceiptForm({ ...receiptForm, platform: 'alipay' })
                      }
                      className="mr-2"
                    />
                    <span className="text-gray-800">支付宝</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2 font-medium">
                  交易单号
                </label>
                <input
                  type="text"
                  value={receiptForm.transactionId}
                  onChange={(e) =>
                    setReceiptForm({ ...receiptForm, transactionId: e.target.value })
                  }
                  placeholder="请输入交易单号（至少8位）"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 transition-colors bg-white"
                  style={{ color: '#1f2937' }}
                />
              </div>

              <button
                onClick={handleUploadReceipt}
                className="w-full py-4 border-2 border-gray-800 text-gray-800 rounded-lg hover:bg-gray-800 hover:text-white transition-colors font-medium text-lg"
              >
                验证并获取次数
              </button>

              <p className="text-xs text-gray-500 text-center">
                演示模式：输入任意8位以上数字即可验证
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <Scan className="w-8 h-8 text-gray-700 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">扫码获得额外机会</h3>
            </div>

            <p className="text-gray-600 mb-6">
              完成社媒发布后，向工作人员出示主页链接即可扫码获得额外抽奖机会
            </p>

            <button
              onClick={handleScanQR}
              className="w-full py-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-lg"
            >
              模拟扫码核销
            </button>

            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700 mb-3 font-medium">发布要求：</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• 小红书/抖音发布内容</li>
                <li>• 带指定话题 #北魏夜游生活节</li>
                <li>• 包含现场元素（照片/视频）</li>
                <li>• 向工作人员出示后扫码</li>
              </ul>
            </div>
          </div>
        </div>

        {records.length > 0 && (
          <div className="mt-12 bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <Gift className="w-8 h-8 text-gray-700 mr-3" />
              <h3 className="text-xl font-semibold text-gray-800">我的奖品</h3>
              <span className="ml-auto text-sm text-gray-500">共 {records.length} 个奖品</span>
            </div>

            <div className="space-y-3">
              {records.slice(0, 5).map((record, index) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">🎁</div>
                    <div>
                      <p className="font-semibold text-gray-800">{record.prize.name}</p>
                      <p className="text-sm text-gray-600">{record.prize.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-gray-700 bg-white px-3 py-1 rounded border">
                      {record.verificationCode}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      向工作人员出示此码兑奖
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {showResultModal && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl p-8">
            <div className="text-center">
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">恭喜您！</h2>
              <p className="text-xl font-semibold text-gray-700 mb-4">
                {result.prize.name}
              </p>
              <p className="text-gray-600 mb-6">{result.prize.description}</p>

              <div className="bg-gray-100 rounded-lg p-6 mb-6">
                <p className="text-sm text-gray-700 mb-2">您的核销码</p>
                <p className="text-2xl font-mono font-bold text-gray-800">
                  {result.verificationCode}
                </p>
              </div>

              <p className="text-sm text-gray-500 mb-6">
                请向工作人员出示核销码完成兑奖
              </p>

              <button
                onClick={() => {
                  setShowResultModal(false)
                  setResult(null)
                }}
                className="w-full bg-gray-800 text-white py-4 rounded-lg hover:bg-gray-700 transition-colors font-medium text-lg"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
