import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'night-festival-secret-key-2024'

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: '未授权，请先登录',
      })
    }

    const token = authHeader.substring(7)

    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      ;(req as any).user = decoded
      next()
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'token无效或已过期',
      })
    }
  } catch (error) {
    next(error)
  }
}

export const generateToken = (userId: string, role: string) => {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: '2h' }
  )
}
