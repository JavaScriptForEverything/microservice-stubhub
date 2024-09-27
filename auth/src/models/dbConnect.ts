import dotenv from 'dotenv'
import { connect, connection } from 'mongoose'

dotenv.config()


export const dbConnect = async () => {
	try {
		// DATABASE_URL also used in session({... store })
		const MONGO_HOST = process.env.MONGO_HOST
		const DATABASE_URL = `mongodb://${MONGO_HOST}/stubhub-auth`

		if(!MONGO_HOST) throw new Error(`Database Connection Error: => DATABASE_URL: ${DATABASE_URL}`)

		if(connection.readyState >= 1) return
		const conn = await connect(DATABASE_URL)	
		const { host, port, name } = conn.connection
		console.log(`---- Database connected to : [${host}:${port}/${name}]----` )

	} catch (err: unknown) {
		if( err instanceof Error) return console.log(`database connection failed: ${err.message}`)
		console.log(err)
	}
}

