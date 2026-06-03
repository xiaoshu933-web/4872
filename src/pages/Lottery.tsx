import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Gift, Upload, Scan } from 'lucide-react'
import { useUserStore } from '@/stores/userStore'

const CARD_STYLE = {
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  padding: '24px 32px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  border: '1px solid #e5e7eb',
}

const INPUT_STYLE = {
  backgroundColor: '#f3f4f6',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  padding: '12px 16px',
  width: '100%',
  fontSize: '14px',
  color: '#111827',
}

const BTN_PRIMARY = {
  backgroundColor: '#1f2937',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '8px',
  width: '100%',
  fontSize: '16px',
  fontWeight: 600,
  cursor: 'pointer',
  border: 'none',
}

const BTN_DISABLED = {
  backgroundColor: '#e5e7eb',
  color: '#9ca3af',
  padding: '16px 24px',
  borderRadius: '8px',
  width: '100%',
  fontSize: '18px',
  fontWeight: 'bold',
  cursor: 'not-allowed',
  border: 'none',
}

const BTN_ACTIVE = {
  background: 'linear-gradient(90deg, #eab308 0%, #f97316 100%)',
  color: '#ffffff',
  padding: '16px 24px',
  borderRadius: '8px',
  width: '100%',
  fontSize: '18px',
  fontWeight: 'bold',
  cursor: 'pointer',
  border: 'none',
  boxShadow: '0 10px 15px -3px rgba(234, 179, 8, 0.3)',
}

export default function Lottery() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, hydrateFromLocalStorage } = useUserStore()
  const [showResultModal, setShowResultModal] = useState(false)
  const [result, setResult] = useState<{ name: string; description: string; level: string; color: string; verificationCode: string } | null>(null)
  const [receiptForm, setReceiptForm] = useState<{ transactionId: string; platform: 'wechat' | 'alipay' }>({
    transactionId: '',
    platform: 'wechat',
  })

  // 使用 localStorage 管理抽奖次数（绕开 store 的严格类型）
  const [drawData, setDrawData] = useState(() => {
    try {
      const saved = localStorage.getItem('lottery-counts')
      if (saved) return JSON.parse(saved)
    } catch (_e) {
      // ignore
    }
    return { totalCount: 0, usedCount: 0, remainingCount: 0 }
  })

  useEffect(() => {
    hydrateFromLocalStorage()
    window.scrollTo(0, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  // 抽奖奖品（本地定义，不依赖 Prize 类型）
  const prizes = [
    { name: '合作商户优惠券', description: '面值50元合作商户通用优惠券', level: '参与奖', color: '#4b5563' },
    { name: '北魏文创冰箱贴', description: '精美北魏文化主题冰箱贴一枚', level: '参与奖', color: '#4b5563' },
    { name: '合作饭店代金券100元', description: '面值100元合作饭店代金券', level: '二等奖', color: '#2563eb' },
    { name: '景区门票一张', description: '大同古城任意景区门票一张', level: '二等奖', color: '#2563eb' },
  ]

  const handleDraw = () => {
    if (drawData.remainingCount <= 0) {
      alert('没有抽奖次数，请先上传消费凭证')
      return
    }

    const selectedPrize = prizes[Math.floor(Math.random() * prizes.length)]
    const verificationCode = 'VF' + Date.now().toString().slice(-8)

    setResult({ ...selectedPrize, verificationCode })
    setShowResultModal(true)

    const newData = {
      totalCount: drawData.totalCount,
      usedCount: drawData.usedCount + 1,
      remainingCount: drawData.remainingCount - 1,
    }
    setDrawData(newData)
    localStorage.setItem('lottery-counts', JSON.stringify(newData))

    // 保存中奖记录（与个人中心同步）
    try {
      const records = JSON.parse(localStorage.getItem('lottery-records') || '[]')
      records.unshift({
        id: Date.now().toString(),
        userId: user?.id || '',
        prize: {
          name: selectedPrize.name,
          description: selectedPrize.description,
          level: selectedPrize.level,
        },
        prizeName: selectedPrize.name,
        verificationCode,
        isVerified: false,
        createdAt: new Date().toISOString(),
      })
      localStorage.setItem('lottery-records', JSON.stringify(records.slice(0, 50)))
    } catch (_e) {
      // ignore
    }
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

    const usedReceipts = JSON.parse(localStorage.getItem('used-receipts') || '[]')
    if (usedReceipts.includes(tid)) {
      alert('该交易单号已使用过，请换一个')
      return
    }
    usedReceipts.push(tid)
    localStorage.setItem('used-receipts', JSON.stringify(usedReceipts))

    const drawCountAdded = Math.floor(Math.random() * 3) + 1
    const newData = {
      totalCount: drawData.totalCount + drawCountAdded,
      usedCount: drawData.usedCount,
      remainingCount: drawData.remainingCount + drawCountAdded,
    }
    setDrawData(newData)
    localStorage.setItem('lottery-counts', JSON.stringify(newData))

    alert('验证成功，获得 ' + drawCountAdded + ' 次抽奖机会！')
    setReceiptForm({ transactionId: '', platform: 'wechat' })
  }

  return (
    <div style={{ minHeight: '100vh', padding: '96px 16px 32px', backgroundColor: '#f9fafb' }}>
      <div style={{ maxWidth: '896px', margin: '0 auto' }}>
        {/* 标题 */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <Gift style={{ width: '64px', height: '64px', margin: '0 auto 12px', color: '#1f2937' }} />
          <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#111827', marginBottom: '12px', fontFamily: 'serif' }}>游客抽奖</h1>
          <p style={{ color: '#4b5563', fontSize: '14px' }}>消费即可参与抽奖，惊喜好礼等你拿</p>
        </div>

        {!isAuthenticated ? (
          <div style={{ ...CARD_STYLE, maxWidth: '448px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{ color: '#374151', marginBottom: '24px' }}>登录后即可参与抽奖</p>
            <button
              onClick={() => navigate('/visitor/login')}
              style={BTN_PRIMARY}
              onMouseOver={(e) => { if (e.currentTarget) e.currentTarget.style.backgroundColor = '#374151' }}
              onMouseOut={(e) => { if (e.currentTarget) e.currentTarget.style.backgroundColor = '#1f2937' }}
            >
              立即登录
            </button>
          </div>
        ) : (
          <>
            {/* 抽奖次数卡片 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px', maxWidth: '672px', marginLeft: 'auto', marginRight: 'auto' }}>
              <div style={{ ...CARD_STYLE, textAlign: 'center' }}>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#ca8a04', marginBottom: '12px' }}>
                  {drawData.remainingCount}
                </div>
                <p style={{ color: '#374151' }}>剩余抽奖次数</p>
              </div>
              <div style={{ ...CARD_STYLE, textAlign: 'center' }}>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#f97316', marginBottom: '12px' }}>
                  {drawData.totalCount}
                </div>
                <p style={{ color: '#374151' }}>累计获得次数</p>
              </div>
            </div>

            {/* 立即抽奖卡片 */}
            <div style={{ ...CARD_STYLE, marginBottom: '32px', maxWidth: '512px', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px', color: '#111827' }}>立即抽奖</h3>
              <button
                onClick={handleDraw}
                style={drawData.remainingCount > 0 ? BTN_ACTIVE : BTN_DISABLED}
                disabled={drawData.remainingCount <= 0}
              >
                点击抽奖
              </button>
              {drawData.remainingCount <= 0 && (
                <p style={{ color: '#4b5563', marginTop: '16px', fontSize: '14px' }}>
                  没有抽奖次数？请上传消费凭证获取
                </p>
              )}
            </div>

            {/* 奖品展示区 */}
            <div style={{ ...CARD_STYLE, marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px', color: '#111827', textAlign: 'center' }}>🎁 奖品池</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {prizes.map((prize, index) => (
                  <div key={index} style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: prize.color, padding: '2px 8px', backgroundColor: 'rgba(234, 179, 8, 0.1)', borderRadius: '12px' }}>
                        {prize.level}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>{prize.name}</h4>
                    <p style={{ fontSize: '14px', color: '#6b7280' }}>{prize.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 下方两个功能区块 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
              {/* 上传消费凭证 */}
              <div style={CARD_STYLE}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <Upload style={{ width: '24px', height: '24px', color: '#ca8a04', marginRight: '8px' }} />
                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#111827', margin: 0 }}>上传消费凭证</h3>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '14px', color: '#374151', marginBottom: '8px' }}>支付平台</label>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', color: '#1f2937' }}>
                        <input
                          type="radio"
                          name="platform"
                          value="wechat"
                          checked={receiptForm.platform === 'wechat'}
                          onChange={() => setReceiptForm({ ...receiptForm, platform: 'wechat' })}
                          style={{ marginRight: '8px' }}
                        />
                        <span>微信支付</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', color: '#1f2937' }}>
                        <input
                          type="radio"
                          name="platform"
                          value="alipay"
                          checked={receiptForm.platform === 'alipay'}
                          onChange={() => setReceiptForm({ ...receiptForm, platform: 'alipay' })}
                          style={{ marginRight: '8px' }}
                        />
                        <span>支付宝</span>
                      </label>
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '14px', color: '#374151', marginBottom: '8px' }}>交易单号</label>
                    <input
                      type="text"
                      value={receiptForm.transactionId}
                      onChange={(e) => setReceiptForm({ ...receiptForm, transactionId: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleUploadReceipt()
                        }
                      }}
                      placeholder="请输入微信/支付宝交易单号（测试版任意8位数字即可）"
                      style={INPUT_STYLE}
                    />
                  </div>

                  <button
                    onClick={handleUploadReceipt}
                    style={BTN_PRIMARY}
                    onMouseOver={(e) => { if (e.currentTarget) e.currentTarget.style.backgroundColor = '#374151' }}
                    onMouseOut={(e) => { if (e.currentTarget) e.currentTarget.style.backgroundColor = '#1f2937' }}
                  >
                    验证并获取次数
                  </button>

                  <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', marginTop: '16px' }}>
                    每笔有效消费可获得1-3次抽奖机会
                  </p>
                </div>
              </div>

              {/* 扫码核销 */}
              <div style={CARD_STYLE}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                  <Scan style={{ width: '24px', height: '24px', color: '#ca8a04', marginRight: '8px' }} />
                  <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#111827', margin: 0 }}>扫码核销</h3>
                </div>

                <p style={{ color: '#374151', marginBottom: '24px' }}>
                  完成社媒发布后，扫描工作人员提供的二维码获取额外抽奖机会
                </p>

                <button
                  onClick={() => navigate('/lottery/scan')}
                  style={BTN_PRIMARY}
                  onMouseOver={(e) => { if (e.currentTarget) e.currentTarget.style.backgroundColor = '#374151' }}
                  onMouseOut={(e) => { if (e.currentTarget) e.currentTarget.style.backgroundColor = '#1f2937' }}
                >
                  打开扫码
                </button>

                <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '12px' }}>
                  <p style={{ fontSize: '14px', color: '#374151', marginBottom: '8px' }}>发布要求：</p>
                  <ul style={{ fontSize: '14px', color: '#4b5563', paddingLeft: '0', listStyle: 'none', lineHeight: '1.8', margin: 0 }}>
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

        {/* 中奖弹窗 */}
        {showResultModal && result && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, padding: '16px'
          }}>
            <div style={{
              backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px',
              maxWidth: '512px', width: '100%', textAlign: 'center',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎁</div>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: result.color, marginBottom: '16px' }}>
                {result.level}
              </p>
              <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px', color: '#111827' }}>
                {result.name}
              </h3>
              <p style={{ color: '#4b5563', marginBottom: '24px' }}>{result.description}</p>
              <div style={{ backgroundColor: '#f3f4f6', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
                <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '8px' }}>核销码</p>
                <p style={{ fontSize: '24px', fontFamily: 'monospace', fontWeight: 'bold', color: '#ca8a04', margin: 0 }}>
                  {result.verificationCode}
                </p>
              </div>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>请向工作人员出示核销码完成兑奖</p>
              <button
                onClick={() => { setShowResultModal(false); setResult(null) }}
                style={BTN_PRIMARY}
                onMouseOver={(e) => { if (e.currentTarget) e.currentTarget.style.backgroundColor = '#374151' }}
                onMouseOut={(e) => { if (e.currentTarget) e.currentTarget.style.backgroundColor = '#1f2937' }}
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
