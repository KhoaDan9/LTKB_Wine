import { Router } from 'express'

import { UserController } from '~/controllers/userController'

const router = Router()
const UserController1 = new UserController()

router.get('/', UserController1.home)
router.get('/reset-password', UserController1.getResetPassword)
router.post('/update', UserController1.update)
router.post('/reset-password', UserController1.resetPassword)

export default router
