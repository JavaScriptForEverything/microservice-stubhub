import express from 'express'
import morgan from 'morgan'

import routers  from './routes'
import * as errorController from './controllers/errorController'
import { dbConnect } from './models/dbConnect'



const app = express()

// middlewares
app.use( express.json() )
app.use(morgan('dev'))



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