import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Gift, Upload, Scan } from 'lucide-react'
import { useUserStore } from '@/stores/userStore'
import { useLotteryStore } from '@/stores/lotteryStore'
import { lotteryService } from '@/services/lottery'

export default function Lottery() {
  const navigate = useNavigate()
  const { user, isAuthenticated, hydrateFromLocalStorage } = useUserStore()
  const { drawCount, setDrawCount, isDrawing, setIsDrawing, addRecord } = useLotteryStore()
  const [showResultModal, setShowResultModal] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [receiptForm, setReceiptForm] = useState({
    transactionId: '',
    platform: 'wechat' as 'wechat' | 'alipay',
  })

  useEffect(() => {
    hydrateFromLocalStorage()
  }, [hydrateFromLocalStorage])

  useEffect(() => {
    if (isAuthenticated) {
      fetchDrawCount()
    }
  }, [isAuthenticated])

  const fetchDrawCount = async () => {
    try {
      const response = await lotteryService.getDrawCount()
      if (response.success) {
        setDrawCount(response.data)
      }
    } catch (error) {
      console.error('获取抽奖次数失败:', error)
    }
  }

  const handleDraw = async () => {
    if (!drawCount || drawCount.remainingCount <= 0) {
      alert('没有抽奖次数，请先上传消费凭证')
      return
    }

    setIsDrawing(true)

    try {
      const response = await lotteryService.draw()

      if (response.success) {
        setResult(response.data)
        setShowResultModal(true)
        addRecord({
          id: Date.now().toString(),
          userId: user!.id,
          prizeId: response.data.prize.id,
          prize: response.data.prize,
          verificationCode: response.data.verificationCode,
          isVerified: false,
          createdAt: new Date().toISOString(),
        })
        fetchDrawCount()
      }
    } catch (error) {
      alert('抽奖失败，请重试')
    } finally {
      setIsDrawing(false)
    }
  }

  const handleUploadReceipt = async () => {
    if (!receiptForm.transactionId) {
      alert('请输入交易单号')
      return
    }

    try {
      const response = await lotteryService.uploadReceipt(
        receiptForm.transactionId,
        receiptForm.platform
      )

      if (response.success) {
        alert(`验证成功，获得 ${response.data.drawCountAdded} 次抽奖机会！`)
        fetchDrawCount()
        setReceiptForm({ transactionId: '', platform: 'wechat' })
      } else {
        alert(response.message || '验证失败')
      }
    } catch (error) {
      alert('验证失败，请检查交易单号是否正确')
    }
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
      participation: 'text-gray-400',
      second: 'text-blue-400',
      first: 'text-purple-400',
      hidden: 'text-gold animate-glow',
    }
    return colors[level] || 'text-gray-400'
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Gift className="w-20 h-20 mx-auto mb-4 text-gold" />
          <h1 className="text-4xl font-serif font-bold gradient-text mb-4">游客抽奖</h1>
          <p className="text-gray-400">消费即可参与抽奖，惊喜好礼等你拿</p>
        </div>

        {!isAuthenticated ? (
          <div className="card max-w-md mx-auto text-center py-12">
            <p className="text-gray-400 mb-6">登录后即可参与抽奖</p>
            <button
              onClick={() => navigate('/visitor/login')}
              className="btn-primary"
            >
              立即登录
            </button>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="card text-center">
                <div className="text-6xl font-bold text-gold mb-4">
                  {drawCount?.remainingCount || 0}
                </div>
                <p className="text-gray-400">剩余抽奖次数</p>
              </div>

              <div className="card text-center">
                <div className="text-6xl font-bold text-sunset mb-4">
                  {drawCount?.totalCount || 0}
                </div>
                <p className="text-gray-400">累计获得次数</p>
              </div>
            </div>

            <div className="card max-w-lg mx-auto mb-8">
              <h3 className="text-xl font-semibold mb-6 text-center">立即抽奖</h3>

              <button
                onClick={handleDraw}
                disabled={!drawCount || drawCount.remainingCount <= 0 || isDrawing}
                className={`w-full py-4 rounded-lg font-bold text-xl transition-all ${
                  drawCount && drawCount.remainingCount > 0 && !isDrawing
                    ? 'bg-gradient-to-r from-gold to-sunset text-primary-dark hover:scale-105'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isDrawing ? '抽奖中...' : '点击抽奖'}
              </button>

              {(!drawCount || drawCount.remainingCount <= 0) && (
                <p className="text-center text-sm text-gray-400 mt-4">
                  没有抽奖次数？请上传消费凭证获取
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="card">
                <div className="flex items-center mb-4">
                  <Upload className="w-6 h-6 text-gold mr-2" />
                  <h3 className="text-xl font-semibold">上传消费凭证</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      支付平台
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
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
                      <label className="flex items-center">
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
                    <label className="block text-sm text-gray-400 mb-2">
                      交易单号
                    </label>
                    <input
                      type="text"
                      value={receiptForm.transactionId}
                      onChange={(e) =>
                        setReceiptForm({ ...receiptForm, transactionId: e.target.value })
                      }
                      placeholder="请输入微信/支付宝交易单号"
                      className="input-field"
                    />
                  </div>

                  <button onClick={handleUploadReceipt} className="btn-secondary w-full">
                    验证并获取次数
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    每笔有效消费可获得1-3次抽奖机会，取决于消费地点
                  </p>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center mb-4">
                  <Scan className="w-6 h-6 text-gold mr-2" />
                  <h3 className="text-xl font-semibold">扫码核销</h3>
                </div>

                <p className="text-gray-400 mb-6">
                  完成社媒发布后，扫描工作人员提供的二维码获取额外抽奖机会
                </p>

                <button
                  onClick={() => navigate('/lottery/scan')}
                  className="btn-primary w-full"
                >
                  打开扫码
                </button>

                <div className="mt-6 p-4 bg-primary rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">发布要求：</p>
                  <ul className="text-sm text-gray-500 space-y-1">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-primary-light rounded-xl w-full max-w-lg mx-4 p-8 text-center animate-slide-up">
              <div className="text-6xl mb-4">
                {result.prize.level === 'hidden' ? '🎉' : '🎁'}
              </div>

              <p className={`text-3xl font-bold mb-4 ${getLevelColor(result.prize.level)}`}>
                {getLevelName(result.prize.level)}
              </p>

              <h3 className="text-2xl font-semibold mb-2">{result.prize.name}</h3>

              <p className="text-gray-400 mb-6">{result.prize.description}</p>

              <div className="bg-primary rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-400 mb-2">核销码</p>
                <p className="text-2xl font-mono font-bold text-gold">
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
                className="btn-primary"
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
