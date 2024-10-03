import { RequestHandler } from 'express'
import { appError, catchAsync } from '../controllers/errorController'
import * as tokenService from '../services/tokenService'


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
	
	const payload = tokenService.verifyAuthToken(req.session.authToken)
	if(!payload) return next(appError( 'yarn token is not valid ', 401, 'AuthError'))

	req.session.userId = payload.id
	req.tokenPayload = payload 				// just for testing

	next()
})