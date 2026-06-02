import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Gift, Upload, Scan } from 'lucide-react'
import { useUserStore } from '@/stores/userStore'
import { useLotteryStore } from '@/stores/lotteryStore'

export default function Lottery() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, hydrateFromLocalStorage } = useUserStore()
  const lotteryStore = useLotteryStore()
  const [showResultModal, setShowResultModal] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [receiptForm, setReceiptForm] = useState({
    transactionId: '',
    platform: 'wechat' as 'wechat' | 'alipay',
  })

  useEffect(() => {
    hydrateFromLocalStorage()
    window.scrollTo(0, 0)
  }, [hydrateFromLocalStorage, location.pathname])

  const prizes = [
    { id: 'p1', name: '合作商户优惠券', description: '面值50元合作商户通用优惠券', level: 'participation' },
    { id: 'p2', name: '北魏文创冰箱贴', description: '精美北魏文化主题冰箱贴一枚', level: 'participation' },
    { id: 'p3', name: '合作饭店代金券100元', description: '面值100元合作饭店代金券', level: 'second' },
    { id: 'p4', name: '景区门票一张', description: '大同古城任意景区门票一张', level: 'second' },
  ]

  const handleDraw = () => {
    const remaining = lotteryStore.drawCount?.remainingCount ?? 0
    if (remaining <= 0) {
      alert('没有抽奖次数，请先上传消费凭证')
      return
    }

    const selectedPrize = prizes[Math.floor(Math.random() * prizes.length)]
    const verificationCode = 'VF' + Date.now().toString().slice(-8)

    setResult({ prize: selectedPrize, verificationCode })
    setShowResultModal(true)

    const current = lotteryStore.drawCount!
    lotteryStore.setDrawCount({
      totalCount: current.totalCount,
      usedCount: current.usedCount + 1,
      remainingCount: current.remainingCount - 1,
    })

    lotteryStore.addRecord({
      id: Date.now().toString(),
      userId: user?.id || '',
      prizeId: selectedPrize.id,
      prize: selectedPrize,
      verificationCode,
      isVerified: false,
      createdAt: new Date().toISOString(),
    })
  }

  const handleUploadReceipt = () => {
    const tid = receiptForm.transactionId.trim()
    if (!tid) {
      alert('请输入交易单号')
      return
    }
    if (tid.length < 8) {
      alert('请输入至少8位的交易单号')
      return
    }

    const usedReceipts = JSON.parse(localStorage.getItem('used_receipts') || '[]')
    if (usedReceipts.includes(tid)) {
      alert('该交易单号已使用过，请换一个')
      return
    }
    usedReceipts.push(tid)
    localStorage.setItem('used_receipts', JSON.stringify(usedReceipts))

    const drawCountAdded = Math.floor(Math.random() * 3) + 1
    const current = lotteryStore.drawCount || { totalCount: 0, usedCount: 0, remainingCount: 0 }
    lotteryStore.setDrawCount({
      totalCount: current.totalCount + drawCountAdded,
      usedCount: current.usedCount,
      remainingCount: current.remainingCount + drawCountAdded,
    })

    alert(`验证成功，获得 ${drawCountAdded} 次抽奖机会！`)
    setReceiptForm({ transactionId: '', platform: 'wechat' })
  }

  const getLevelName = (level: string) => {
    const names: Record<string, string> = {
      participation: '参与奖',
      second: '二等奖',
      first: '一等奖',
      hidden: '隐藏大奖',
    }
    return names[level] || '参与奖'
  }

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      participation: 'text-gray-600',
      second: 'text-blue-600',
      first: 'text-purple-600',
      hidden: 'text-yellow-600',
    }
    return colors[level] || 'text-gray-600'
  }

  const remainingCount = lotteryStore.drawCount?.remainingCount ?? 0
  const totalCount = lotteryStore.drawCount?.totalCount ?? 0

  return (
    <div className="min-h-screen pt-24 pb-8 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <Gift className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 md:mb-4 text-gray-800" />
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3 md:mb-4">游客抽奖</h1>
          <p className="text-gray-600">消费即可参与抽奖，惊喜好礼等你拿</p>
        </div>

        {!isAuthenticated ? (
          <div className="max-w-md mx-auto text-center py-10 md:py-12 bg-white rounded-2xl shadow-lg">
            <p className="text-gray-700 mb-6">登录后即可参与抽奖</p>
            <button
              onClick={() => navigate('/visitor/login')}
              className="px-8 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
            >
              立即登录
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-12 max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl p-6 md:p-8 text-center shadow-md">
                <div className="text-5xl md:text-6xl font-bold text-yellow-600 mb-3 md:mb-4">
                  {remainingCount}
                </div>
                <p className="text-gray-700">剩余抽奖次数</p>
              </div>

              <div className="bg-white rounded-2xl p-6 md:p-8 text-center shadow-md">
                <div className="text-5xl md:text-6xl font-bold text-orange-500 mb-3 md:mb-4">
                  {totalCount}
                </div>
                <p className="text-gray-700">累计获得次数</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 mb-6 md:mb-8 max-w-lg mx-auto shadow-md">
              <h3 className="text-xl font-semibold mb-6 text-center text-gray-900">立即抽奖</h3>

              <button
                onClick={handleDraw}
                disabled={remainingCount <= 0}
                className={`w-full py-4 rounded-lg font-bold text-lg md:text-xl transition-all ${
                  remainingCount > 0
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                点击抽奖
              </button>

              {remainingCount <= 0 && (
                <p className="text-center text-sm text-gray-600 mt-4">
                  没有抽奖次数？请上传消费凭证获取
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md">
                <div className="flex items-center mb-4">
                  <Upload className="w-6 h-6 text-yellow-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900">上传消费凭证</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">支付平台</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center text-gray-800">
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
                        <span>微信支付</span>
                      </label>
                      <label className="flex items-center text-gray-800">
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
                        <span>支付宝</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">交易单号</label>
                    <input
                      type="text"
                      value={receiptForm.transactionId}
                      onChange={(e) =>
                        setReceiptForm({ ...receiptForm, transactionId: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleUploadReceipt()
                        }
                      }}
                      placeholder="请输入微信/支付宝交易单号（测试版任意8位数字即可）"
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500 text-gray-900 placeholder-gray-400"
                    />
                  </div>

                  <button
                    onClick={handleUploadReceipt}
                    className="w-full py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    验证并获取次数
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    每笔有效消费可获得1-3次抽奖机会
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md">
                <div className="flex items-center mb-4">
                  <Scan className="w-6 h-6 text-yellow-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900">扫码核销</h3>
                </div>

                <p className="text-gray-700 mb-6">
                  完成社媒发布后，扫描工作人员提供的二维码获取额外抽奖机会
                </p>

                <button
                  onClick={() => navigate('/lottery/scan')}
                  className="w-full py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors mb-6"
                >
                  打开扫码
                </button>

                <div className="p-4 bg-gray-100 rounded-xl">
                  <p className="text-sm text-gray-700 mb-2">发布要求：</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 小红书/抖音发布内容</li>
                    <li>• 带指定话题 #北魏夜游生活节</li>
                    <li>• 包含现场元素（照片/视频）</li>
                    <li>• 向工作人员展示后扫码</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}

        {showResultModal && result && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl w-full max-w-lg mx-4 p-6 md:p-8 text-center shadow-2xl">
              <div className="text-6xl mb-4">
                {result.prize.level === 'hidden' ? '🎉' : '🎁'}
              </div>

              <p className={`text-3xl font-bold mb-4 ${getLevelColor(result.prize.level)}`}>
                {getLevelName(result.prize.level)}
              </p>

              <h3 className="text-2xl font-semibold mb-2 text-gray-900">{result.prize.name}</h3>

              <p className="text-gray-600 mb-6">{result.prize.description}</p>

              <div className="bg-gray-100 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">核销码</p>
                <p className="text-2xl font-mono font-bold text-yellow-600">
                  {result.verificationCode}
                </p>
              </div>

              <p className="text-sm text-gray-500 mb-6">请向工作人员出示核销码完成兑奖</p>

              <button
                onClick={() => {
                  setShowResultModal(false)
                  setResult(null)
                }}
                className="px-8 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
              >
                确定
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
