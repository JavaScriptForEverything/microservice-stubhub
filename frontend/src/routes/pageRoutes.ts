import { Router } from 'express';
import * as pageController from '../controllers/pageController'

export const router = Router()



// 	/
router
	.get('/register', pageController.register)
	.get('/login', pageController.login)
	.get('/', pageController.home)