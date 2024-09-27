import { Router } from 'express'
import { router as authRouter } from './authRouter'

const router = Router()

router.use('/api/users', authRouter)


export default router