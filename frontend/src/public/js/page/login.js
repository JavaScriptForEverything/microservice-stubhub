import { $, redirectTo, showError } from '/js/module/utils.js'

const loginFrom = $('[name=login-form]')

const loginUser = async (field) => {
	const tempObj = {
		data: {},
		error: ''
	}

	try {
		const { data } = await axios.post('/api/users/login', field)
		tempObj.data = data
	} catch (err) {
		if(err.response.data) tempObj.error = err.response.data
		if(err.response.data.message) tempObj.error = err.message
		console.log(err.response.data)
	}

	return tempObj
}



loginFrom.addEventListener('submit', async (evt) => {
	evt.preventDefault()

	const submitButton = evt.target.querySelector('button[type=submit]')
	submitButton.disabled = true
	console.log(submitButton)

	const formData = new FormData(evt.target)
	const fields = Object.fromEntries(formData)
	console.log(fields)

	const { data, error } = await loginUser(fields)

	if(error) { 		// if auth route down
		showError(error)
		submitButton.disabled = false
		return 
	}
	if(data.message) { 	// send error from auth error handler
		showError(data.message)
		submitButton.disabled = false
		return 
	}

	console.log(data)
	submitButton.disabled = false
	redirectTo('/')

})
