import { Request, Response, NextFunction } from 'express'

let contentConfig = {
  id: 'config_1',
  backgroundType: 'image',
  backgroundUrl: '',
  mainTitle: '四八七十二',
  subTitle: '日落后出发：北魏夜游生活节',
  themeText: '落日夜游，大有不同',
  organizer: '大同市人民政府',
  undertaker: '大同市文化旅游投资集团有限公司、大同古城文化旅游发展有限公司',
  copyright: '地球明天爆炸',
  updatedAt: new Date(),
}

export const getContent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json({
      success: true,
      data: contentConfig,
    })
  } catch (error) {
    next(error)
  }
}

export const updateContent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updates = req.body

    contentConfig = {
      ...contentConfig,
      ...updates,
      updatedAt: new Date(),
    }

    res.json({
      success: true,
      message: '配置已更新',
      data: contentConfig,
    })
  } catch (error) {
    next(error)
  }
}
