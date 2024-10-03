import { Router } from 'express'
import * as ticketController from '../controllers/ticketController'
import { protect } from '../middlewares'

// /api/tickets
export const router = Router()

router.route('/')
	.get(ticketController.getTickets)
	.post( protect, ticketController.createTicket)

router
	.use(protect)
	.route('/:ticketId')
	.get(ticketController.getTicketById)
	.patch(ticketController.updateTicketById)
	.delete(ticketController.deleteTicketById)

