import request from 'supertest'
import { app } from '../src/app'



describe.skip('POST /api/users/register', () => {

	it('register new user', async () => {

		const body = {
			"name": "riajul islam",
			"email": "riajul@gmail.com",
			"password" : "asdfasdf",
			"confirmPassword": "asdfasdf"
		}

		const res = await request(app)
			.post('/api/users/register')
			.send(body)

		expect(res.status).toBe(201) 																	// comes from backend res.status
		expect(res.body.status).toBe('success') 											// comes from backend res.status
		expect(res.body.data).toHaveProperty('name', body.name) 			// comes from backend res.data.name
		expect(res.body.data).toHaveProperty('email', body.email) 		// comes from backend res.data.email
	})

	it('register failed: password missing', async () => {

		const body = {
			"name": "riajul islam",
			"email": "riajul@gmail.com",
		}

		const res = await request(app)
			.post('/api/users/register')
			.send(body)

		expect(res.status).toBe(400) 																	// comes from backend res.status
		expect(res.body.status).toBe(400) 														// comes from backend appError
		expect(res.body.statusName).toBe('ValidationError') 					// comes from backend appError

		// value comes from mongoose error: copy-paste here
		expect(res.body.message).toEqual(["confirmPassword: Path `confirmPassword` is required.", "password: Path `password` is required."]) 			// comes from backend appError
	})

	it('register failed: invalid email', async () => {

		const body = {
			"name": "riajul islam",
			"email": "riajulgmail.com",
			"password" : "asdfasdf",
			"confirmPassword": "asdfasdf"
		}

		const res = await request(app)
			.post('/api/users/register')
			.send(body)

		expect(res.status).toBe(400) 																	// comes from backend res.status
		expect(res.body.status).toBe(400) 														// comes from backend appError
		expect(res.body.statusName).toBe('ValidationError') 					// comes from backend appError

		// value comes from mongoose error: copy-paste here
		expect(res.body.message).toEqual([ 'email: Validator failed for path `email` with value `riajulgmail.com`' ]) 
	})

	it('Duplicate email', async () => {

		const body = {
			"name": "riajul islam",
			"email": "riajul@gmail.com",
			"password" : "asdfasdf",
			"confirmPassword": "asdfasdf"
		}

		const res = await request(app)
			.post('/api/users/register')
			.send(body)

		expect(res.status).toBe(201) 																	// comes from backend res.status
		expect(res.body.status).toBe('success') 											// comes from backend appError

		const res2 = await request(app)
			.post('/api/users/register')
			.send(body)

		expect(res2.status).toBe(400) 																	
		expect(res2.body.status).toBe(400) 															
		expect(res2.body.statusName).toBe('MongoServerError') 					// comes from mongoose
		expect(res2.body.message).toEqual('Duplicate Fields:  email_1 dup key: { email: "riajul@gmail.com" }') 
	})

})