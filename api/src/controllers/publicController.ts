import { Request, Response, NextFunction } from 'express'

const contentConfig = {
  id: 'config_1',
  backgroundType: 'image',
  backgroundUrl: '/images/default-bg.jpg',
  mainTitle: '四八七十二',
  subTitle: '日落后出发：北魏夜游生活节',
  themeText: '落日夜游，大有不同',
  organizer: '大同市人民政府',
  undertaker: '大同市文化旅游投资集团有限公司、大同古城文化旅游发展有限公司',
  copyright: '地球明天爆炸',
}

const prizes = [
  {
    id: 'p1',
    name: '合作商户优惠券',
    description: '面值50元合作商户通用优惠券',
    level: 'participation',
    image: '',
  },
  {
    id: 'p2',
    name: '北魏文创冰箱贴',
    description: '精美北魏文化主题冰箱贴一枚',
    level: 'participation',
    image: '',
  },
  {
    id: 'p3',
    name: '合作饭店代金券100元',
    description: '面值100元合作饭店代金券',
    level: 'second',
    image: '',
  },
  {
    id: 'p4',
    name: '景区门票一张',
    description: '大同古城任意景区门票一张',
    level: 'second',
    image: '',
  },
  {
    id: 'p5',
    name: '民宿免费住宿1晚',
    description: '合作民宿免费住宿一晚体验券',
    level: 'first',
    image: '',
  },
  {
    id: 'p6',
    name: '汉服体验套票',
    description: '含妆造+摄影服务',
    level: 'first',
    image: '',
  },
  {
    id: 'p7',
    name: '既下山·云阙景观大床房',
    description: '云阙景观大床房住宿券1晚',
    level: 'hidden',
    image: '',
  },
]

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

export const getPrizes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json({
      success: true,
      data: prizes,
    })
  } catch (error) {
    next(error)
  }
}
