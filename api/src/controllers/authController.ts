import { Request, Response, NextFunction } from 'express'
import { generateToken } from '../middlewares/authenticate'

const demoUsers: Map<string, any> = new Map()
const verificationCodes: Map<string, string> = new Map()

export const sendCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phone } = req.body

    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        error: '请输入有效的手机号',
      })
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    verificationCodes.set(phone, code)

    console.log(`[Demo] 验证码 ${code} 已发送到 ${phone}`)

    res.json({
      success: true,
      message: '验证码已发送',
      data: { expiresIn: 300 },
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { phone, code } = req.body

    if (!phone || !code) {
      return res.status(400).json({
        success: false,
        error: '请输入手机号和验证码',
      })
    }

    const storedCode = verificationCodes.get(phone)
    if (!storedCode || storedCode !== code) {
      return res.status(401).json({
        success: false,
        error: '验证码错误或已过期',
      })
    }

    verificationCodes.delete(phone)

    let user = demoUsers.get(phone)
    if (!user) {
      user = {
        id: `user_${Date.now()}`,
        phone,
        role: 'visitor',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      demoUsers.set(phone, user)
    }

    const token = generateToken(user.id, user.role)

    res.json({
      success: true,
      data: {
        token,
        user,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user.userId

    let user = null
    demoUsers.forEach((u) => {
      if (u.id === userId) {
        user = u
      }
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        error: '用户不存在',
      })
    }

    res.json({
      success: true,
      data: user,
    })
  } catch (error) {
    next(error)
  }
}
