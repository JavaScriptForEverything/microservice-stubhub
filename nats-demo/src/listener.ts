import { randomUUID } from 'node:crypto'
import nats, { Message } from 'node-nats-streaming'
console.clear()

const stan = nats.connect('stubhub', randomUUID(), {
	url: 'http://localhost:4222'
	// url: 'nats://localhost:4222'
})


stan.on('connect', (socket) => {
	console.log('listener connected to NATS')

	// // allow to listen on every replics of pod: open multiple termianl and see response send to every one 
	// const subscribe = stan.subscribe('ticket:created')

	// // allow to listen only one replica: open multiple termianl and see response send to single one at a time
	// const subscribe = stan.subscribe('ticket:created', 'ticketQueueGroup')

	// others options
	const subscriptionOptions = stan.subscriptionOptions()
		.setManualAckMode(true) 		// (1.1) it ask for ack that event receive, if not it will re-sent that event to other replics

	const subscribe = stan.subscribe('ticket:created', 'ticketQueueGroup', subscriptionOptions)

	subscribe.on('message', (msg: Message) => {
		const sequence = msg.getSequence()
		let data = msg.getData() as string
		console.log(`[${sequence}]: ${data} \n`)

		msg.ack() 	// (1.2) it confirm setManualAckMode(true), that I received message, so don't re-emit this event again
	})
})

