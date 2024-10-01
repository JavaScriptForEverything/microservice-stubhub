
const $ = (selector) => document.querySelector(selector)

const registerForm = $('[name=register-form]')

const registerUser = async (field) => {
	const tempObj = {}

	try {
		const { data } = await axios.post('/api/users/register', field)
		tempObj.data = data
	} catch (err) {
		if(err.error) return tempObj.message = err.message
		console.log(err)
	}

	return tempObj
}

registerForm.addEventListener('submit', async (evt) => {
	evt.preventDefault()

	const formData = new FormData(evt.target)
	const fields = Object.fromEntries(formData)
	console.log(fields)

	const { data, error } = await registerUser(fields)
	if(error) return console.log(error)

	console.log(data)
})
