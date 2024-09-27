
/* 	/users 					=> Auth Service
			. POST /signup
			. POST /signin
			. POST /signout
			. GET  /currentuser

   	/tickets 				=> Tickets Service
   	/orders 				=> Orders Service
   	/payments 			=> Payments Service
   	/expiration 		=> Expiration Service

*/

const user = {
	email: '', 					// => string
	password: '', 			// => string
}
const order = {
	userId: '', 				// => Types.ObjectId, ref: User
	status: '', 				// => created | cancelled | completed | awaitingPayment
	ticketId: '', 			// => Types.ObjectId, ref: Ticket
}
const ticket = {
	title: '', 					// => string
	price: '', 					// => number
	userId: '', 				// => Types.ObjectId, ref: User
	orderId: '', 				// => Types.ObjectId, ref: Order
}
const charge = {
	orderId: '', 				// => Types.ObjectId, ref: Order
	status: '', 				// => string
	amount: '', 				// => number
	stripeId: '', 			// => string
	stripeRefundId: '', // => string
}


