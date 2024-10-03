import { app } from './app'
import { dbConnect } from './models/dbConnect'


const PORT = 5000
app.listen( PORT, () => {
	dbConnect() 		
	console.log(`tickets-server running on: http://localhost:${PORT}`)
})