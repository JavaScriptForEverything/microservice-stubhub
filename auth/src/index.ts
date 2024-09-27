import express from 'express'

const app = express()

app.use( express.json() )

// /api/users/currentuser
app.get('/api/users/me', (req, res) => {
	res.status(200).json({
		status: 'success',
		data: {
			name: 'riajul islam',
			age: 29
		}
	})
})

const PORT = 5000

app.listen( PORT, () => {
	console.log(`server running on: http://localhost:${PORT}`)
})