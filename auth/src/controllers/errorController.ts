/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ErrorRequestHandler, NextFunction, Request, RequestHandler, Response } from 'express'
import type { IncomingMessage, Server, ServerResponse } from 'node:http'

type Fn = {
	(req:Request, res:Response, next:NextFunction): Promise<any>
}
export const catchAsync = (fn: Fn ) => {
	return (req:Request, res:Response, next:NextFunction) => {
		return fn(req, res, next).catch(next)
	}
}

type MyError = Error & {
  message: string;
  status: number;
  statusName: string
}

// export const appError = (message='', statusCode=400, status='error') => {
// 	const error = new Error(message) 	as MyError
// 	error.statusCode = statusCode
// 	error.status = status

// 	return error
// }
export const appError = (message='', status=400, statusName='error') => {
	const error = new Error(message) 	as MyError
	error.status = status
	error.statusName = statusName

	return error
}


// Express Global Error handler
export const globalErrorHandler:ErrorRequestHandler = (err, _req, res, _next) => {
	const { NODE_ENV = 'development' } = process.env

	if(!err.message) {
		res.status(err.status || 400).json({
			message: err,
			status: err.status || 400,
			statusName: 'unknown',
			stack: NODE_ENV === 'development' ? err.stack : undefined
		})
	}

	// 1. Give simple message for InvalidId Error
	if(err.name === 'CastError') {
		err.message = `Invalid ID: ${err.value}`
		err.status = err.status || 400
		err.statusName = err.name
	}

	// 2. Give simple message for Duplicate (Unique Field) Error
	if(err.code === 11000) {
		err.message = `Duplicate Fields: ${err.message.split('index:').pop()}`
		err.status = err.status || 400
		err.statusName = err.name
	}

	// 3. Give simple message for ValidationError
	if(err.errors) {
		const message = Object.entries( err.errors ).map( ([key, value]) => {
			if(value instanceof Error) {
				return `${key}: ${value.message}`
			}
		})
		err.message = message
		err.status = err.status || 400
		err.statusName = err.name
	}

	// 4.1: JsonWebToken Modification Error
  if(err.name === 'JsonWebTokenError') {
		err.status = 401
		err.statusName = err.name
	}
	// 4.2: JsonWebToken Expire Error
  if(err.name === 'TokenExpiredError') {
		err.status = 401
		err.statusName = err.name
	}


	res.status(err.status || 400).json({
		message: err.message,
		status: err.status || 400,
		statusName: err.statusName || 'failed',
		stack: NODE_ENV === 'development' ? err.stack : undefined
	})
}

export const routeNotFound:RequestHandler = (req, _res, next) => {
	next(appError(`route ${req.originalUrl} not found`, 404, 'NotFound'))
}


/* app.ts: put it begining of the app
// => Test synchronous error handler
throw 'Test synchronous error handler'
throw new Error('Test synchronous error handler') */
// export const exceptionErrorHandler = () => {
// 	process.on('uncaughtException', (err: unknown) => {

// 		if(err instanceof Error) {
// 			console.log(`Blocking: Global Error Handler: ${err.message}`)
// 			process.exit(1)
// 			return
// 		}

// 		console.log(`Blocking: Error Handler: ${err}`)
// 		process.exit(1)

// 	})
// }

export const exceptionErrorHandler = () => {
	process.on('uncaughtException', (err: unknown) => {

		let errorMessage = 'Blocking: Global Error Handler: '
				errorMessage += err instanceof Error ? err.message : err

		console.log(errorMessage)
		process.exit(1)

	})
}


/* server.ts: put it very end of the app
	=> Test Asynchronous Error handler 
	Promise.reject('Test Asynchronous Error handler')
	Promise.reject(new Error('Test Asynchronous Error handler')) */
export const promiseErrorHandler = (server: Server<typeof IncomingMessage, typeof ServerResponse>) => {
	process.on('unhandledRejection', (err: unknown) => {

		if(err instanceof Error) {
			console.log(`Unblocking: Global Error Handler: ${err.message}`)
			server.close( (_err) => process.exit(1))
			return
		}

		console.log(`Unblocking: Global Error Handler: ${err}`)
		server.close( (_err) => process.exit(1))


	})
}

