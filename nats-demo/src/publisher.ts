import { randomUUID } from 'node:crypto'
import nats from 'node-nats-streaming'

console.clear()

const stan = nats.connect('stubhub', randomUUID(), {
	url: 'nats://localhost:4222'
})


stan.on('connect', (socket) => {
	console.log('publisher connected to NATS')

	// Step-2: When get close signal: from any event, by ours or program
	stan.on('close', () => {
		console.log('connection terminated')

		process.exit() 				// Step-3: kill process immediatly instead of waiting (30 x NumberOfCount)s
	})

	const data = JSON.stringify({
		name: 'riajul',
		age: 30
	})
	socket.publish('ticket:created', data, (returnData: any) => {
		console.log('send created data')
	})
})


// Step-1: when singnal to close stan: tell stan to close connection
process.on('SIGINT', () => stan.close()) 		// Signal Interrupt : rs 	(nodemon ReStart)
process.on('SIGTERM', () => stan.close()) 	// Singal Terminate : close process, like: ctrl + C, ...

