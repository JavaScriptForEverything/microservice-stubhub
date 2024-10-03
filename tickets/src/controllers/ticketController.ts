import { RequestHandler } from 'express'
import { appError, catchAsync } from './errorController'
import Ticket from '../models/ticketModel'
// import * as tokenService from '../services/tokenService'




// GET /api/tickets
export const getTickets: RequestHandler = catchAsync(async (req, res, next) => {
	const tickets = await Ticket.find({})

	res.status(200).json({
		status: 'success',
		count: tickets.length,
		data: tickets
	})
})

// POST /api/tickets
export const createTicket: RequestHandler = catchAsync( async (req, res, next) => {

	console.log(req.session)

	req.body.userId = req.session?.userId

	const ticket = await Ticket.create(req.body)
	if(!ticket) return next(appError('No ticket found')) 

	res.status(201).json({
		status: 'success',
		data: ticket
	})
})


// GET /api/tickets/:ticketId
export const getTicketById: RequestHandler = catchAsync( async (req, res, next) => {
	const ticket = await Ticket.findById(req.params.ticketId)
	if(!ticket) return next(appError('ticket not found', 400))

	res.status(200).json({
		status: 'success',
		data: ticket
	})
})



// PATCH 	/api/tickets/:ticketId
export const updateTicketById: RequestHandler = catchAsync( async (req, res, next) => {
	const ticket = await Ticket.findByIdAndUpdate(req.params.ticketId, req.body, { new: true })
	if(!ticket) return next(appError('ticket not found'))

	res.status(200).json({
		status: 'success',
		data: ticket
	})
})


// DELETE 	/api/tickets/:ticketId
export const deleteTicketById: RequestHandler = catchAsync( async (req, res, next) => {
	const ticket = await Ticket.findByIdAndDelete(req.params.ticketId)
	if(!ticket) return next(appError('ticket not found'))

	res.status(204).json({
		status: 'success',
		data: ticket
	})
})


