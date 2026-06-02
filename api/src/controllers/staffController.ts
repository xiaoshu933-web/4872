import { Request, Response, NextFunction } from 'express'

const qrCodes: Map<string, any> = new Map()

const demoMerchants = [
  {
    id: 'm1',
    name: '北魏小吃店',
    contactPerson: '张三',
    contactPhone: '13800138001',
    status: 'pending',
    isFoodMerchant: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'm2',
    name: '古城文创坊',
    contactPerson: '李四',
    contactPhone: '13800138002',
    status: 'pending',
    isFoodMerchant: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: 'm3',
    name: '夜游咖啡馆',
    contactPerson: '王五',
    contactPhone: '13800138003',
    status: 'approved',
    isFoodMerchant: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
]

export const generateQR = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const qrCode = `QR${Date.now()}${Math.floor(Math.random() * 1000)}`
    const expiresAt = new Date(Date.now() + 30 * 1000)

    qrCodes.set(qrCode, {
      status: 'pending',
      expiresAt,
    })

    res.json({
      success: true,
      data: {
        qrCode,
        expiresAt,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getMerchants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { status } = req.query

    let filtered = demoMerchants
    if (status) {
      filtered = demoMerchants.filter((m) => m.status === status)
    }

    res.json({
      success: true,
      data: filtered,
    })
  } catch (error) {
    next(error)
  }
}

export const approveMerchant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    const merchantIndex = demoMerchants.findIndex((m) => m.id === id)
    if (merchantIndex === -1) {
      return res.status(404).json({
        success: false,
        error: '商户不存在',
      })
    }

    demoMerchants[merchantIndex].status = 'approved'
    demoMerchants[merchantIndex].certificateNumber = `CERT${Date.now()}`

    res.json({
      success: true,
      message: '审核通过',
      data: demoMerchants[merchantIndex],
    })
  } catch (error) {
    next(error)
  }
}

export const rejectMerchant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const { reason } = req.body

    const merchantIndex = demoMerchants.findIndex((m) => m.id === id)
    if (merchantIndex === -1) {
      return res.status(404).json({
        success: false,
        error: '商户不存在',
      })
    }

    demoMerchants[merchantIndex].status = 'rejected'
    demoMerchants[merchantIndex].rejectReason = reason || '不符合入驻条件'

    res.json({
      success: true,
      message: '已驳回',
      data: demoMerchants[merchantIndex],
    })
  } catch (error) {
    next(error)
  }
}

export const getStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json({
      success: true,
      data: {
        totalUsers: 1234,
        totalDraws: 5678,
        totalMerchants: 89,
        pendingMerchants: 3,
        totalVerifications: 456,
        todayVerifications: 23,
      },
    })
  } catch (error) {
    next(error)
  }
}
