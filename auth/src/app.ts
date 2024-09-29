import express from 'express'
import morgan from 'morgan'
import cookieSession from 'cookie-session'

import routers  from './routes'
import * as errorController from './controllers/errorController'
import { dbConnect } from './models/dbConnect'



const app = express()

app.set('trust proxy', true) 			// because traffic will in borxy through ingress nginx

// middlewares
app.use( express.json() )
app.use(morgan('dev'))


/* cookieSession how it works ?
		- if request has cookie, then cookieSession read that from cookie, and store into req.session, 
			and when send response back to user, it set that session into cookie, if user modify session 
			before sending response then modified session will be sent as cookie.
*/ 
app.use(cookieSession({ 	
	signed: false, 					// no need to encrypt, jwt is already encrypted
	secure: process.env.NODE_ENV === 'production', 					
}))

// route handlers
app.use('/', routers) 	


// global error handler
app.all('*', errorController.routeNotFound)
app.use(errorController.globalErrorHandler)


const PORT = 5000
app.listen( PORT, () => {
	dbConnect() 		
	console.log(`server running on: http://localhost:${PORT}`)
})