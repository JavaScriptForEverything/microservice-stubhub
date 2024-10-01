import { Router } from 'express';

export const router = Router()



// 	/
router.route('/')
	.get((req, res, next) => {

		const payload = {
			title: 'Home Page'
		}
		res.render('home', payload )

	})