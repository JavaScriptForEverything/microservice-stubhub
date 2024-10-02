import { RequestHandler } from 'express'
import axios from 'axios'


export const register: RequestHandler = (req, res, next) => {

	const payload = {
		title: 'Register Page'
	}
	res.render('page/register', payload )

}
export const login: RequestHandler = (req, res, next) => {

	const payload = {
		title: 'Login Page'
	}
	res.render('page/login', payload )

}
export const home: RequestHandler = (req, res, next) => {

	const payload = {
		title: 'Home Page',
		req,
		axios
	}

	res.render('page/home', payload )

}