import { RequestHandler } from 'express'
import { appError, catchAsync } from './errorController'
import User from '../models/userModel'
import * as tokenService from '../services/tokenService'

//-----[ Middleware ]-----

declare global {
	namespace Express {
		interface Request {
			tokenPayload?: tokenService.TokenPayload 	// may or may not exists (un authenticated time)
		}
	}
}


// router.get('/api/users' protect, ...)
export const protect:RequestHandler = catchAsync( async (req, res, next) => {
	if(!req.session?.authToken) return next(appError( 'you are not logedin user', 401, 'AuthError'))
	
	const payload = await tokenService.verifyAuthToken(req.session.authToken)
	if(!payload) return next(appError( 'yarn token is not valid ', 401, 'AuthError'))

	req.session.userId = payload.id
	req.tokenPayload = payload

	next()
})


// GET /api/users/me 	=  router.get('/me', protect, getLogedInUser, getUserById)
export const getLogedInUser: RequestHandler = catchAsync( async (req, res, next) => {
	req.params.userId = req.session?.userId

	next()
})





// GET /api/users
export const getUsers: RequestHandler = catchAsync(async (req, res, next) => {
	const users = await User.find({})

	res.status(200).json({
		status: 'success',
		count: users.length,
		data: users
	})
})

// POST /api/users
export const createUser: RequestHandler = catchAsync( async (req, res, next) => {

	const user = await User.create(req.body)
	if(!user) return next(appError('No user found'))

	// user.password = ''

	res.status(201).json({
		status: 'success',
		data: user
	})
})


// GET /api/users/:userId
export const getUserById: RequestHandler = catchAsync( async (req, res, next) => {
	const user = await User.findById(req.params.userId)
	if(!user) return next(appError('user not found'))

	res.status(200).json({
		status: 'success',
		data: user
	})
})



// PATCH 	/api/users/:userId
export const updateUserById: RequestHandler = catchAsync( async (req, res, next) => {
	const user = await User.findByIdAndUpdate(req.params.userId, req.body)
	if(!user) return next(appError('user not found'))

	res.status(200).json({
		status: 'success',
		data: user
	})
})


// DELETE 	/api/users/:userId
export const deleteUserById: RequestHandler = catchAsync( async (req, res, next) => {
	const user = await User.findByIdAndDelete(req.params.userId)
	if(!user) return next(appError('user not found'))

	res.status(204).json({
		status: 'success',
		data: user
	})
})


// POST /api/users/register
// handled by createUser

// POST /api/users/login
export const login: RequestHandler = catchAsync( async (req, res, next) => {
	const { email='', password='' } = req.body
	if(!email || !password) return next(appError('please pass email and password'))

	const user = await User.findOne({ email }).select('+password')
	if(!user) return next(appError('User Not found', 401, 'AuthError'))




	// // verifyPassword
	// const isAuthenticated = await user.comparePassword(password)
	// if(!isAuthenticated) return next(appError('User Not found', 401, 'AuthError'))

	// Generate Token
	const authToken = await tokenService.generateAuthToken(user.id)

	// req.session.authToken = authToken 		// => it throw error
	req.session = { 												// but it works
		authToken: authToken
	}


	// user.password = ''  		// hide password

	res.status(200).json({
		status: 'success',
		data: user
	})
})

// POST /api/users/logout
export const logout: RequestHandler = (req, res, next) => {
	req.session = null 		// that's it, rest will be handle cookie-session

	res.status(200).json({
		status: 'success',
		message: 'you loged out successfully',
		data: null
	})
}