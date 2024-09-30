import request from 'supertest'
import { app } from '../src/app'



describe.skip('POST /api/users/register, then POST /api/users/login', () => {

	// make sure user already exists, to sign
	it('login will failed: no user found by riajul@gmail.com', async () => {

		try {
			const body = {
				"email": "riajul@gmail.com",
				"password" : "asdfasdf",
			}

			const res = await request(app)
				.post('/api/users/login')
				.send(body)

			expect(res.status).toBe(401) 		
			expect(res.body.status).toBe(401) 
			expect(res.body.statusName).toBe('AuthError') 

			expect(res.body.message).toBe('User Not found') 
			expect(res.body).toHaveProperty('message', 'User Not found') 


		} catch (err: any) {
			if(err.response) return console.log(err.response.body)
			console.log(err)
		}
	})
	
	
	
	it('login will failed: incrorrect password ', async () => {

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
		expect(res.body.status).toBe('success') 														// Error status
		expect(res.body.data).toHaveProperty('email', body.email) 		

		try {
			// We need to register inside same test, because in setup file: forEach delete collections
			const res = await request(app)
				.post('/api/users/login')
				.send({
					"email": "riajul@gmail.com",
					"password" : "asdf",
				})

			expect(res.status).toBe(401) 																	
			expect(res.body.status).toBe(401) 														// comes from backend 
			expect(res.body.message).toBe('Password incrorrect') 
			expect(res.body).toHaveProperty('message', 'Password incrorrect') 


		} catch (err: any) {
			if(err.response) return console.log(err.response.body)
			console.log(err)
		}
	})
	
	
	
	
	
	// make sure user already exists, to sign
	it('success login', async () => {

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

		try {
			// We need to register inside same test, because in setup file: forEach delete collections
			const res = await request(app)
				.post('/api/users/login')
				.send(body)

			expect(res.status).toBe(200) 																	// comes from backend 
			expect(res.body.status).toBe('success') 											// comes from backend 
			expect(res.body.data).toHaveProperty('email', body.email) 		// comes from backend res.data.email

			expect(res.get('Set-Cookie')).toBeDefined() 									// check cookie exists

		} catch (err: any) {
			if(err.response) return console.log(err.response.body)
			console.log(err)
		}
	})


})
