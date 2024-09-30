import request from 'supertest'
import { app } from '../src/app'

describe('GET /api/users/me', () => {

	it('get logedin user', async () => {
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

		const cookie = res2.get('Set-Cookie')!
		// console.log(cookie) 		// => ['cookie1', ...]

		// Step-3: get me
		const res3 = await request(app)
			.get('/api/users/me')
			.set('Cookie', cookie) 				// Must pass cookie with header, else show un-authenticated user error

		expect(res3.status).toBe(200)
		expect(res3.body.data).toHaveProperty('name', body.name)

		expect(res3.body.data).toEqual(res.body.data)
		expect(res3.body.data).toEqual(res2.body.data)

	})
})




// body = typeof signupBody
export const getCookie = async (body: any) => {

		// Step-1: Signup
		const res = await request(app)
			.post('/api/users/register')
			.send(body)
			.expect(201)

		// Step-2: login
		const res2 = await request(app)
			.post('/api/users/login')
			.send(body)
			.expect(200)

		const cookie = res2.get('Set-Cookie')!
		return cookie
}

describe('GET /api/users/me', () => {
	it('get logedin user: by function', async () => {

		const body = {
			"name": "riajul islam",
			"email": "riajul@gmail.com",
			"password" : "asdfasdf",
			"confirmPassword": "asdfasdf"
		}

		const cookie = await getCookie(body)

		const res = await request(app)
			.get('/api/users/me')
			.set('Cookie', cookie)

		expect(res.status).toBe(200)
		expect(res.body.data).toHaveProperty('name', body.name)

	})
})