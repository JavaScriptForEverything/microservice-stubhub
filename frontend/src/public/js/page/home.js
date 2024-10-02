import { $, showError } from '/js/module/utils.js'


const logoutButton = $('[name=logout]')
const showMeP = $('[name=show-me]')

const getUser = async () => {
	const tempObj = {
		data: {},
		error: ''
	}

	try {
		const { data } = await axios.get('/api/users/me')
		tempObj.data = data
	} catch (err) {
		if(err.response.data) tempObj.error = err.response.data
		if(err.response.data.message) tempObj.error = err.message
		console.log(err.response.data)
	}

	return tempObj
}

const logoutUser = async () => {
	const tempObj = {
		data: {},
		error: ''
	}

	try {
		const { data } = await axios.post('/api/users/logout')
		tempObj.data = data
	} catch (err) {
		if(err.response.data) tempObj.error = err.response.data
		console.log(err.response.data)
	}

	return tempObj
}



addEventListener('DOMContentLoaded', async (evt) => {
	evt.preventDefault()

	const { data, error } = await getUser()

	if(error) return showError(error) 	// if auth route down
	if(data.message) return showError(data.message) 	// send error from auth error handler
	
	console.log(data)
	const jsonData = JSON.stringify(data, null, 2) 
	updateUI(jsonData)
})


logoutButton.addEventListener('click', async (evt) => {
	evt.preventDefault()

	const { data, error } = await logoutUser()

	if(error) { 		// if auth route down
		showError(error)
		evt.target.disabled = false
		return 
	}
	console.log(data)
	evt.target.disabled = false
})


const updateUI = (data) => {
	showMeP.textContent = data	
}