import { Request, Response, NextFunction } from 'express'

const demoPrizes = [
  {
    id: 'p1',
    name: '合作商户优惠券',
    description: '面值50元合作商户通用优惠券',
    level: 'participation',
    probability: 0.85,
    stock: 1000,
    isActive: true,
  },
  {
    id: 'p2',
    name: '北魏文创冰箱贴',
    description: '精美北魏文化主题冰箱贴一枚',
    level: 'participation',
    probability: 0.10,
    stock: 500,
    isActive: true,
  },
  {
    id: 'p3',
    name: '合作饭店代金券100元',
    description: '面值100元合作饭店代金券',
    level: 'second',
    probability: 0.035,
    stock: 30,
    isActive: true,
  },
  {
    id: 'p4',
    name: '景区门票一张',
    description: '大同古城任意景区门票一张',
    level: 'second',
    probability: 0.015,
    stock: 50,
    isActive: true,
  },
  {
    id: 'p5',
    name: '民宿免费住宿1晚',
    description: '合作民宿免费住宿一晚体验券',
    level: 'first',
    probability: 0.004,
    stock: 5,
    isActive: true,
  },
  {
    id: 'p6',
    name: '汉服体验套票',
    description: '含妆造+摄影服务',
    level: 'first',
    probability: 0.001,
    stock: 3,
    isActive: true,
  },
  {
    id: 'p7',
    name: '既下山·云阙景观大床房',
    description: '云阙景观大床房住宿券1晚',
    level: 'hidden',
    probability: 0.001,
    stock: 1,
    isActive: true,
  },
]

const drawCounts: Map<string, any> = new Map()
const lotteryRecords: Map<string, any[]> = new Map()
const usedTransactions: Set<string> = new Set()

export const bindPhone = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.userId
    const { phone } = req.body

    res.json({
      success: true,
      message: '手机号绑定成功',
    })
  } catch (error) {
    next(error)
  }
}

export const bindIdentity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, idCard } = req.body

    res.json({
      success: true,
      message: '身份信息绑定成功',
    })
  } catch (error) {
    next(error)
  }
}

export const uploadReceipt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.userId
    const { transactionId, platform } = req.body

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        error: '请输入交易单号',
      })
    }

    if (usedTransactions.has(transactionId)) {
      return res.status(400).json({
        success: false,
        error: '该交易单号已使用过',
      })
    }

    usedTransactions.add(transactionId)

    const isMarket = Math.random() > 0.5
    const isPartner = Math.random() > 0.5

    let drawCountAdded = 1
    if (isMarket) drawCountAdded += 1
    if (isPartner) drawCountAdded += 1

    const currentCount = drawCounts.get(userId) || { totalCount: 0, usedCount: 0 }
    drawCounts.set(userId, {
      totalCount: currentCount.totalCount + drawCountAdded,
      usedCount: currentCount.usedCount,
    })

    res.json({
      success: true,
      message: '交易验证成功',
      data: {
        drawCountAdded,
        totalDrawCount: currentCount.totalCount + drawCountAdded,
        isMarket,
        isPartner,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getDrawCount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.userId

    const count = drawCounts.get(userId) || { totalCount: 0, usedCount: 0 }

    res.json({
      success: true,
      data: {
        userId,
        totalCount: count.totalCount,
        usedCount: count.usedCount,
        remainingCount: count.totalCount - count.usedCount,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const draw = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.userId

    const count = drawCounts.get(userId)
    if (!count || count.usedCount >= count.totalCount) {
      return res.status(400).json({
        success: false,
        error: '没有抽奖次数',
      })
    }

    const availablePrizes = demoPrizes.filter((p) => p.stock > 0 && p.isActive)

    const totalProb = availablePrizes.reduce((sum, p) => sum + p.probability, 0)
    let random = Math.random() * totalProb

    let selectedPrize = availablePrizes[0]
    for (const prize of availablePrizes) {
      random -= prize.probability
      if (random <= 0) {
        selectedPrize = prize
        break
      }
    }

    const verificationCode = `VF${Date.now()}${Math.floor(Math.random() * 1000)}`

    const record = {
      id: `record_${Date.now()}`,
      userId,
      prizeId: selectedPrize.id,
      prize: selectedPrize,
      verificationCode,
      isVerified: false,
      createdAt: new Date(),
    }

    const userRecords = lotteryRecords.get(userId) || []
    userRecords.push(record)
    lotteryRecords.set(userId, userRecords)

    count.usedCount += 1
    drawCounts.set(userId, count)

    const prizeIndex = demoPrizes.findIndex((p) => p.id === selectedPrize.id)
    if (prizeIndex !== -1) {
      demoPrizes[prizeIndex].stock -= 1
    }

    res.json({
      success: true,
      data: {
        prize: selectedPrize,
        verificationCode,
        remainingDrawCount: count.totalCount - count.usedCount,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getPrizes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json({
      success: true,
      data: demoPrizes.filter((p) => p.isActive),
    })
  } catch (error) {
    next(error)
  }
}

export const scanQR = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.userId
    const { qrCode } = req.body

    const currentCount = drawCounts.get(userId) || { totalCount: 0, usedCount: 0 }
    drawCounts.set(userId, {
      totalCount: currentCount.totalCount + 1,
      usedCount: currentCount.usedCount,
    })

    res.json({
      success: true,
      message: '扫码成功，获得1次抽奖机会',
      data: {
        drawCountAdded: 1,
        totalDrawCount: currentCount.totalCount + 1,
      },
    })
  } catch (error) {
    next(error)
  }
}
