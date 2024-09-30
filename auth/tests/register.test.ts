import request from 'supertest'
import { app } from '../src/app'

describe('Register new user', () => {

	it('POST /api/users/register', () => {
		const body = {
			"name": "riajul islam",
			"email": "riajul@gmail.com",
			"password" : "asdfasdf",
			"confirmPassword": "asdfasdf"
		}

		return request(app) 												// Method-1: must return else use done() to tell, async task finished
			.post('/api/users/register')
			.send(body)

			// .expect(201) 													// we handle success and error by api, so no need it here
			.then( (res) => {
				if(res.status === 201) {

					expect(res.body.status).toBe('success') 											// comes from backend res.status
					expect(res.body.data).toHaveProperty('name', body.name) 			// comes from backend res.data.name
					expect(res.body.data).toHaveProperty('email', body.email) 		// comes from backend res.data.email

				} else if (res.status === 400) {

					expect(res.body.status).toBe(400) 														// comes from backend appError
					expect(res.body.statusName).toBe('ValidationError') 					// comes from backend appError

				} else {
					throw new Error(`Unexpected status code: ${res.status}`) 			// Server Error
				}

			})
			.catch((err) => { 				// handle those error, which my api don't handled
				if(err.response) return console.log('Unexpected error response:', err.response.body)

				console.log('Unexpected error response:', err)
				return err 							// required to tell supertest that, async task is done
			})
	})


	it('register user in 2nd way', async () => {

		const body = {
			"name": "riajul islam",
			"email": "riajul@gmail.com",
			"password" : "asdfasdf",
			"confirmPassword": "asdfasdf"
		}

		const res = await request(app)
			.post('/api/users/register')
			.send(body)

		// expect(res.status).toBe(201)																// we handle success and error by api, so no need it here
		try {
			if(res.status === 201) {

				expect(res.body.status).toBe('success') 											// comes from backend res.status
				expect(res.body.data).toHaveProperty('name', body.name) 			// comes from backend res.data.name
				expect(res.body.data).toHaveProperty('email', body.email) 		// comes from backend res.data.email

			} else if (res.status === 400) {

				expect(res.body.status).toBe(400) 														// comes from backend appError
				expect(res.body.statusName).toBe('ValidationError') 					// comes from backend appError

			} else {
				throw new Error(`Unexpected status code: ${res.status}`) 			// Server Error
			}

		} catch (err: any) { // handle those error, which my api don't handled
			
			if(err.response) return console.log('Unexpected error response:', err.response.body)
			console.log('Unexpected error response:', err)
		}
	})

})