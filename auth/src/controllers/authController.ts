import { RequestHandler } from 'express'
import { appError } from './errorController'
import User from '../models/userModel'

//-----[ Middleware ]-----

// GET /api/users/me 	=  router.get('/me', autherController.getLogedInUser, autherController.getUserById)
export const getLogedInUser: RequestHandler = (req, res, next) => {
	console.log(req.params)

	req.body.user = {
		name: 'riajul islam',
		age: 29
	}

	next()
}





// GET /api/users
export const getUsers: RequestHandler = (req, res, next) => {

	res.status(200).json({
		status: 'success',
		data: [{
			name: 'riajul islam',
			age: 29
		}]
	})
}

// POST /api/users
export const createUser: RequestHandler = async (req, res, next) => {

	const user = await User.create(req.body)
	if(!user) return next(appError('No user found'))

		user.email



	res.status(201).json({
		status: 'success',
		data: user
	})
}


// GET /api/users/:userId
export const getUserById: RequestHandler = (req, res, next) => {
	console.log(req.params)

	const user = req.body.user || req.body

	res.status(200).json({
		status: 'success',
		data: user
	})
}



// PATCH 	/api/users/:userId
export const updateUserById: RequestHandler = (req, res, next) => {
	console.log(req.params)

	res.status(200).json({
		status: 'success',
		data: req.body
	})
}


// DELETE 	/api/users/:userId
export const deleteUserById: RequestHandler = (req, res, next) => {
	console.log(req.params)

	res.status(204).json({
		status: 'success',
		data: {}
	})
}


// POST /api/users/register
// handled by createUser

// POST /api/users/login
export const login: RequestHandler = (req, res, next) => {

	res.status(200).json({
		status: 'success',
		data: req.body
	})
}

// POST /api/users/logout
export const logout: RequestHandler = (req, res, next) => {

	res.status(200).json({
		status: 'success',
		data: {}
	})
}