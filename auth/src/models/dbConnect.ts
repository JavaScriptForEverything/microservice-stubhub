import { connect, connection } from 'mongoose'
import dotenv from 'dotenv' 					// no need, kubernetes secret handles it in Pod.env
dotenv.config()


export const dbConnect = async () => {
	try {
		const MONGO_HOST = process.env.MONGO_HOST
		const DATABASE_URL = `mongodb://${MONGO_HOST}/stubhub-auth`

		if(!MONGO_HOST) throw new Error(`auth-atabase Connection Error: => DATABASE_URL: ${DATABASE_URL}`)

		if(connection.readyState >= 1) return
		const conn = await connect(DATABASE_URL)	
		const { host, port, name } = conn.connection
		console.log(`---- auth-database connected to : [${host}:${port}/${name}]----` )

	} catch (err: unknown) {
		if( err instanceof Error) return console.log(`auth-database connection failed: ${err.message}`)
		console.log(err)
	}
}

