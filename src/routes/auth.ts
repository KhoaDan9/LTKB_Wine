import { Router } from 'express'
import { AuthController } from '../controllers/authController'
import { loginValidation, registerValidation } from '~/middlewares/validate'

const router = Router()
const AuthController1 = new AuthController()

router.get('/login', AuthController1.islogin)

router.get('/register', AuthController1.isregister)

router.post('/register', registerValidation(), AuthController1.register)

router.post('/login', loginValidation(), AuthController1.login)

export default router
