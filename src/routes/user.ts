import { Router } from 'express'

import { AuthController } from '../controllers/authController'

const router = Router()
const AuthController1 = new AuthController()

router.get('/', AuthController1.home)

router.post('/register', AuthController1.register)

router.post('/login', AuthController1.login)

// module.exports = router;
export default router
