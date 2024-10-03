import { Router } from 'express'
import { router as authRouter } from './authRoutes'

const router = Router()

// /api/users
router.use('/api/users', authRouter)


export default router