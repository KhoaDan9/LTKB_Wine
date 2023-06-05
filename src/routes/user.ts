import { Router } from 'express'
import { AuthController } from '../controllers/authController'
import verifyToken from '../middlewares/auth'

const router = Router()
const AuthController1 = new AuthController()

router.get('/login', AuthController1.islogin)

router.get('/register', AuthController1.isregister)

router.post('/register', AuthController1.register)

router.post('/login', AuthController1.login)

export default router
