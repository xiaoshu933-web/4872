export interface User {
  id: string
  phone: string
  name?: string
  idCard?: string
  role: 'visitor' | 'merchant' | 'staff' | 'admin'
  createdAt: string
  updatedAt: string
}

export interface Merchant {
  id: string
  userId: string
  name: string
  contactPerson: string
  contactPhone: string
  idCardImage: string
  businessLicense: string
  healthCertificate?: string
  isFoodMerchant: boolean
  status: 'pending' | 'approved' | 'rejected'
  rejectReason?: string
  certificateNumber?: string
  createdAt: string
  updatedAt: string
}

export interface Prize {
  id: string
  name: string
  description: string
  image?: string
  level: 'participation' | 'second' | 'first' | 'hidden'
  probability: number
  stock: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface LotteryRecord {
  id: string
  userId: string
  prizeId: string
  prize?: Prize
  verificationCode: string
  isVerified: boolean
  verifiedAt?: string
  verifiedBy?: string
  createdAt: string
}

export interface Receipt {
  id: string
  userId: string
  transactionId: string
  platform: 'wechat' | 'alipay'
  amount: number
  merchantId?: string
  isMarket: boolean
  isPartner: boolean
  drawCountAdded: number
  status: 'pending' | 'verified' | 'failed'
  createdAt: string
}

export interface ContentConfig {
  id: string
  backgroundType: 'image' | 'video'
  backgroundUrl: string
  mainTitle: string
  subTitle: string
  themeText: string
  organizer: string
  undertaker: string
  copyright: string
}

export interface ChatMessage {
  id: string
  userId: string
  staffId?: string
  content: string
  type: 'text' | 'image'
  sender: 'user' | 'staff'
  isRead: boolean
  createdAt: string
}

export interface DrawCount {
  userId: string
  totalCount: number
  usedCount: number
  remainingCount: number
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
