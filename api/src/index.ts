import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { authRoutes } from './routes/auth'
import { visitorRoutes } from './routes/visitor'
import { merchantRoutes } from './routes/merchant'
import { staffRoutes } from './routes/staff'
import { adminRoutes } from './routes/admin'
import { publicRoutes } from './routes/public'
import { errorHandler } from './middlewares/errorHandler'

dotenv.config()

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/visitor', visitorRoutes)
app.use('/api/merchant', merchantRoutes)
app.use('/api/staff', staffRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/public', publicRoutes)

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' })
})

app.use(errorHandler)

const findAvailablePort = (startPort: number): Promise<number> => {
  return new Promise((resolve) => {
    const server = createServer()
    server.listen(startPort, () => {
      server.close(() => {
        resolve(startPort)
      })
    })
    server.on('error', () => {
      resolve(findAvailablePort(startPort + 1))
    })
  })
}

const startServer = async () => {
  const startPort = parseInt(process.env.PORT || '4000')
  const availablePort = await findAvailablePort(startPort)
  
  app.listen(availablePort, () => {
    console.log(`Server is running on port ${availablePort}`)
    console.log(`API available at http://localhost:${availablePort}/api`)
  })
}

startServer()

export default app
