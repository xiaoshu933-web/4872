import { Request, Response, NextFunction } from 'express'

const merchantApplications: Map<string, any> = new Map()

export const apply = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.userId
    const { name, contactPerson, contactPhone, isFoodMerchant, idCardImage, businessLicense, healthCertificate } = req.body

    if (!name || !contactPerson || !contactPhone) {
      return res.status(400).json({
        success: false,
        error: '请填写完整信息',
      })
    }

    const application = {
      id: `merchant_${Date.now()}`,
      userId,
      name,
      contactPerson,
      contactPhone,
      isFoodMerchant,
      idCardImage,
      businessLicense,
      healthCertificate,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    merchantApplications.set(userId, application)

    res.json({
      success: true,
      message: '申请已提交，请等待审核',
      data: {
        id: application.id,
        status: application.status,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.userId

    const application = merchantApplications.get(userId)

    if (!application) {
      return res.json({
        success: true,
        data: null,
      })
    }

    res.json({
      success: true,
      data: application,
    })
  } catch (error) {
    next(error)
  }
}
