import { Router } from 'express'
import * as autherController from '../controllers/authController'

// /api/users
export const router = Router()

router.get('/me', autherController.protect, autherController.getLogedInUser, autherController.getUserById)
router.post('/register', autherController.createUser)
router.post('/login', autherController.login)
router.post('/logout', autherController.logout)


router.route('/')
	.get(autherController.getUsers)
	.post(autherController.createUser)

router.route('/:userId')
	.get(autherController.getUserById)
	.patch(autherController.updateUserById)
	.delete(autherController.deleteUserById)

