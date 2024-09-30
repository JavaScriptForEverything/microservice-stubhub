import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

let mongo = new MongoMemoryServer()

beforeAll( async () => {
	await mongo.start()
	const mongoUri = await mongo.getUri()

	await mongoose.connect( mongoUri )
})


// To reset all data before every test
beforeEach( async () => {
	const collections = await mongoose.connection.db?.collections()

	if(!collections) return
	for( let collection of collections ) {
		await collection.deleteMany({})
	}
})

afterAll( async () => {
	await mongo.stop()
	await mongoose.connection.close()
})


