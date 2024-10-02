import { Snackbar } from '/js/components/index.js'

// const avatarEl = $('[name=avatar]')
export const $ = (selector) => document.querySelector( selector )

// redirectTo('/register')
export const redirectTo = (path, { base='' } = {}) => {
	const url = new URL( path, base || location.origin ) 		// get current url
	location.href = url.href 	
}

export const showError = (message, reason) => {
	Snackbar({
		severity: 'error',
		message,
		autoClose: true,
		closeTime: 3000
	})
}
export const showSuccess = (message, reason) => {
	Snackbar({
		severity: 'success',
		message,
		autoClose: true,
		closeTime: 3000
	})
}


// Convert '<p> hi </p>' 	=> .createElement('p').textContent = 'hi'
export const stringToElement = ( htmlString ) => {
	const parser = new DOMParser()
	const doc = parser.parseFromString( htmlString, 'text/html' )

	return doc.body.firstChild
}


// toggleClass(evt.target, 'active')
export const toggleClass = (selector, className='active') => {
	const { classList } = selector
	classList.toggle(className, !classList.contains(className))
}




export const readAsDataURL = (file, { type='image' } = {}) => {
	return new Promise((resolve, reject) => {

		if(type === 'image') {
			const isImage = file?.type.match('image/*')
			if(!isImage) return reject(new Error('Please select an image') )
		}

		const reader = new FileReader()
		reader.readAsDataURL(file)
		reader.addEventListener('load', () => {
			if(reader.readyState === 2) {
				resolve(reader.result)
			}
		})
		reader.addEventListener('error', reject)
	})
}
