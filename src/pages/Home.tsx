import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

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

function loadConfig() {
  try {
    const saved = localStorage.getItem('night_festival_config')
    if (saved) {
      const parsed = JSON.parse(saved)
      return { ...DEFAULT_CONFIG, ...parsed }
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
          return {
            ...DEFAULT_CONFIG,
            ...parsedContent,
            background1: bg1,
            background2: bg2,
            background3: bg3,
          }
        } catch {}
      }
      return { ...DEFAULT_CONFIG, background1: bg1, background2: bg2, background3: bg3 }
    } catch {
      return DEFAULT_CONFIG
    }
  return DEFAULT_CONFIG
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [config, setConfig] = useState(DEFAULT_CONFIG)

  useEffect(() => {
    setConfig(loadConfig())
  }, [])

  const backgrounds = [config.background1, config.background2, config.background3].filter(
    (bg) => bg && bg.length > 0
  )

  const isValidBackground = (bg: string) => {
    return bg && (bg.startsWith('http') || bg.startsWith('#') || bg.startsWith('data:'))
  }

  const validBackgrounds = backgrounds.filter(isValidBackground)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % validBackgrounds.length || 0)
    }, 5000)
    return () => clearInterval(timer)
  }, [validBackgrounds.length])

  const currentBg = validBackgrounds[currentSlide] || ''
  const isColorBackground = currentBg.startsWith('#')

  return (
    <div className="min-h-screen">
      <section className="relative min-h-screen w-full overflow-hidden">
        {validBackgrounds.length > 0 ? (
          isColorBackground ? (
            <div
              className="absolute inset-0 transition-opacity duration-1000"
              style={{ backgroundColor: currentBg }}
            />
          ) : (
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
              style={{ backgroundImage: `url(${currentBg})` }}
            />
          )
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700" />
        )}

        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 h-screen flex items-end justify-end">
          <div className="container mx-auto px-8 pb-16">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white drop-shadow-lg text-right">
              {config.mainTitle}
            </h1>
          </div>
        </div>

        {validBackgrounds.length > 1 && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {validBackgrounds.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-white scale-110'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-serif text-center mb-4 text-gray-800">
            活动信息
          </h2>
          <div className="w-20 h-1 bg-gray-300 mx-auto mb-12"></div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-800 mb-3">📍 活动地点</p>
              <div className="space-y-1">
                <p className="text-gray-700 text-xl">{config.locationLine1}</p>
                <p className="text-gray-700 text-xl">{config.locationLine2}</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg font-medium text-gray-800 mb-4">🕐 活动时间</p>
              <div className="space-y-2">
                {config.activityTime
                  .split('\n')
                  .map((line, index) => (
                    <p key={index} className="text-gray-700 text-xl">
                      {line}
                    </p>
                  ))}
              </div>
            </div>

            <div className="text-center md:col-span-2 mt-6">
              <p className="text-lg font-medium text-gray-800 mb-4">🏛️ 组织单位</p>
              <div className="space-y-3 text-center">
                <p className="text-gray-700 font-medium text-lg">
                  主办单位：{config.organizer}
                </p>
                <p className="text-gray-600">
                  承办单位：{config.undertaker}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center space-y-4">
            <Link
              to="/visitor/login"
              className="inline-block bg-gray-800 text-white px-10 py-4 rounded-lg hover:bg-gray-700 transition-colors font-medium text-lg"
            >
              参与抽奖
            </Link>
            <div>
              <Link
                to="/merchant/login"
                className="inline-block border-2 border-gray-300 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-100 hover:border-gray-500 transition-colors font-medium"
              >
                商家入驻申请
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
