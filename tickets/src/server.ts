import { randomUUID } from 'node:crypto'
import { app } from './app'
import { dbConnect } from './models/dbConnect'
import { natsWrapper } from './nats-wrapper'

const clusterId = 'stubhub' 						// used in nats-deploy.yaml argus: `--cluster_id='stubhub`
const clientId = randomUUID() 					// required unique client ID
const url = 'http://nats-svc:4222' 			// from nats-deploy.yaml service's name to connect internally with nats-streaming server

const PORT = 5000
app.listen( PORT, async () => {
	try {
		await dbConnect() 		
		console.log(`tickets-server running on: http://localhost:${PORT}`)


		await natsWrapper.connect(clusterId, clientId, url)
		process.on('SIGINT', () => natsWrapper.client.close()) 		// Signal Interrupt : rs 	(nodemon ReStart)
		process.on('SIGTERM', () => natsWrapper.client.close()) 	// Singal Terminate : close process, like: ctrl + C, ...

		natsWrapper.client.on('close', () => {
			console.log('connection terminated')

			process.exit() 				// Step-3: kill process immediatly instead of waiting (30 x NumberOfCount)s
		})

	} catch (err) {
		console.log('Error: => /tickets/server.ts: ', err)
	}
})