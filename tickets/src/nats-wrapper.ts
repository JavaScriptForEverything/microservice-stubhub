import nats, { Stan } from 'node-nats-streaming'

/**
 * Step-1: Define here so that can use same instance if needed on multiple page
 * Step-2: Create connection after database connection in server.ts
 * Step-3: Send data by client.on('connect', () => {...}) === stan.on('connect', () => {...}) when you want
 */

class NatsWrapper {
	private _client?: Stan

	// natsWrapper.client 	: to access getter function as property
	get client() {
		if(!this._client) throw new Error("you can't get client before connect(...) ")
		return this._client
	}

	connect (clusterId: string, clientId: string, url: string ) {
		this._client = nats.connect(clusterId, clientId, { url })

		return new Promise((resolve, reject) => {

			this.client.on('connect', () => {
				resolve('void')
				console.log('connection established')
			})
			this.client.on('error', (err) => reject(`/tickets/nats-wrapper: ${err.message}`, ))

		})

	}
}

export const natsWrapper = new NatsWrapper()
// export const stan = natsWrapper



