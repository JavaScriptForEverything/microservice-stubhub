import { Router } from 'express';
import * as pageController from '../controllers/pageController'

export const router = Router()



// 	/
router
	.get('/', pageController.home)