import { Router } from 'express'
import { router as ticketRouter } from './ticketRoutes'

const router = Router()

// /api/tickets
router.use('/api/tickets', ticketRouter)


export default router