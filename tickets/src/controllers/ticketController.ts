import { RequestHandler } from 'express'
import { appError, catchAsync } from './errorController'
import Ticket from '../models/ticketModel'
import { natsWrapper } from '../nats-wrapper'
// import * as tokenService from '../services/tokenService'
import { randomUUID } from 'node:crypto'




// GET /api/tickets
export const getTickets: RequestHandler = catchAsync(async (req, res, next) => {
	const tickets = await Ticket.find({})

	res.status(200).json({
		status: 'success',
		count: tickets.length,
		data: tickets
	})
})

// POST /api/tickets + protect()
export const createTicket: RequestHandler = catchAsync( async (req, res, next) => {

	// comes from logedInUser session
	req.body.userId = req.session?.userId

	const ticket = await Ticket.create(req.body)
	if(!ticket) return next(appError('No ticket found')) 

	// Send Event to NATS server
	// const stan = natsWrapper.client
	const clusterId = 'stubhub' 						// used in nats-deploy.yaml argus: `--cluster_id='stubhub`
	const clientId = randomUUID() 					// required unique client ID
	const url = 'http://nats-svc:4222' 			// from nats-deploy.yaml service's name to connect internally with nats-streaming server
	natsWrapper.connect(clusterId, clientId, url)
	natsWrapper.client.on('connect', () => {
		const data = JSON.stringify({
			id: ticket.id,
			name: ticket.name,
			price: ticket.price,
		})
		natsWrapper.client.publish('ticket:created', data, () => {
			console.log('data sent to ticket:created channel')
		})

	})

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


