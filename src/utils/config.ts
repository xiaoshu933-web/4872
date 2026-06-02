export const DEFAULT_CONFIG = {
  mainTitle: '日落后出发',
  activityTime: '夏季：6月15日至9月15日\n冬季：12月1日至次年3月10日',
  organizer: '大同市人民政府',
  undertaker: '大同市文化旅游投资集团有限公司、大同古城文化旅游发展有限公司',
  locationLine1: '大同市平城区',
  locationLine2: '大同古城',
  copyright: '仅用于毕业设计',
  background1: '',
  background2: '',
  background3: '',
  mobileBackground1: '',
  mobileBackground2: '',
  mobileBackground3: '',
}

const LOCAL_STORAGE_KEY = 'night_festival_config'

type Config = typeof DEFAULT_CONFIG

export async function loadConfig(): Promise<Config> {
  let baseConfig: Config = { ...DEFAULT_CONFIG }

  try {
    const response = await fetch('/config.json')
    if (response.ok) {
      const serverConfig = await response.json()
      baseConfig = { ...DEFAULT_CONFIG, ...serverConfig }
    }
  } catch (e) {
    console.warn('无法从服务器读取配置，使用默认值')
  }

  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved) {
      const localConfig = JSON.parse(saved)
      return { ...baseConfig, ...localConfig }
    }
  } catch (e) {
    console.error('加载本地配置失败:', e)
  }

  try {
    const bg1 = localStorage.getItem('admin_background_1') || ''
    const bg2 = localStorage.getItem('admin_background_2') || ''
    const bg3 = localStorage.getItem('admin_background_3') || ''
    const mobileBg1 = localStorage.getItem('admin_mobile_background_1') || ''
    const mobileBg2 = localStorage.getItem('admin_mobile_background_2') || ''
    const mobileBg3 = localStorage.getItem('admin_mobile_background_3') || ''
    const content = localStorage.getItem('admin_content')
    if (content) {
      try {
        const parsedContent = JSON.parse(content)
        return {
          ...baseConfig,
          ...parsedContent,
          background1: bg1,
          background2: bg2,
          background3: bg3,
          mobileBackground1: mobileBg1,
          mobileBackground2: mobileBg2,
          mobileBackground3: mobileBg3,
        }
      } catch {}
    }
    if (bg1 || bg2 || bg3 || mobileBg1 || mobileBg2 || mobileBg3) {
      return { ...baseConfig, background1: bg1, background2: bg2, background3: bg3, mobileBackground1: mobileBg1, mobileBackground2: mobileBg2, mobileBackground3: mobileBg3 }
    }
  } catch {}

  return baseConfig
}

export function saveConfig(config: Config): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config))
  } catch (e) {
    console.error('保存配置失败:', e)
    alert('保存失败：图片可能过大，请使用较小的图片或图片URL')
  }
}

export function exportConfigAsJson(config: Config): string {
  return JSON.stringify(config, null, 2)
}

export function downloadConfigFile(config: Config): void {
  const json = exportConfigAsJson(config)
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'config.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
