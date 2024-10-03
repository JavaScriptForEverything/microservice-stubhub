import supertest from 'supertest'
import { app } from '../src/app'

import { generateAuthToken } from '../src/services/tokenService'
import { Types } from 'mongoose'
// import { protect } from '../src/middlewares'
// import * as middlewares from '../src/middlewares'


export const getCookie = () => {
	const id = new Types.ObjectId().toString()
	const authToken = generateAuthToken(id)
	const session = { authToken }
	const sessionJson = JSON.stringify(session)

	const base64 = Buffer.from(sessionJson).toString('base64')
	const cookie = `express:sess=${base64}`
	return cookie
}

export const getAuthToken = () => {
	const id = new Types.ObjectId().toString()
	const authToken = generateAuthToken(id)
	return authToken
}


// jest.mock('../src/middlewares', () => jest.fn((req, res, next) => {
// 	req.session.authToken = getAuthToken()
// 	next()
// }));


describe('POST /api/tickets', () => {

	it('creating ticket', async () => {
		const body = {
			name: 'my first ticket',
			price: '300'
		}
		const cookie = getCookie()
		console.log(cookie)

		const res = await supertest(app)
			.post('/api/tickets')
			.send(body)
			.set('Cookie', [cookie]) 		// set cookie as array, in supertest
			.expect(201)

		expect(res.status).toBe(201)
		expect(res.body.status).toBe('success') 										// comes from backend
		expect(res.body.data).toHaveProperty('price', body.price) 	// comes from backend

	})
	// it('creating ticket failed: missing price', async () => {
	// 	const body = {
	// 		name: 'my first ticket',
	// 	}

	// 	const res = await supertest(app)
	// 		.post('/api/tickets')
	// 		.send(body)
	// 		.expect(400)

	// 	expect(res.status).toBe(400)
	// 	expect(res.body.statusName).toBe('ValidationError') 										// comes from mongoose
	// 	expect(res.body.message).toEqual(["price: Path `price` is required."]) 	// comes from mongoose
	// })
})
