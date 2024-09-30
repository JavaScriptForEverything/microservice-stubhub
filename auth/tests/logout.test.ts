import request from 'supertest'
import { app } from '../src/app'

describe.skip('POST /api/users/logout', () => {

	it('logout user', async () => {
		// Step-1: Signup
		const body = {
			"name": "riajul islam",
			"email": "riajul@gmail.com",
			"password" : "asdfasdf",
			"confirmPassword": "asdfasdf"
		}

		const res = await request(app)
			.post('/api/users/register')
			.send(body)

		expect(res.status).toBe(201)
		expect(res.body.status).toBe('success')
		expect(res.body.data).toHaveProperty('name', body.name)


		// Step-2: login
		const res2 = await request(app)
			.post('/api/users/login')
			.send(body)

		expect(res2.status).toBe(200)
		expect(res2.body.status).toBe('success')
		expect(res2.body.data).toHaveProperty('name', body.name)

		expect(res2.get('Set-Cookie')).toBeDefined()

		// Step-3: logout
		const res3 = await request(app)
			.post('/api/users/logout')
			.send(body)

		expect(res3.status).toBe(200)
		expect(res3.body.status).toBe('success')
		expect(res3.body).toHaveProperty('message',  'you loged out successfully')

		// because after login cookie set, and logout value null, but still remain
		expect(res3.get('Set-Cookie')).toBeDefined() 		

	})
})