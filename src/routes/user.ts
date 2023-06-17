import { Router } from 'express'

import { UserController } from '~/controllers/userController'
import { resetPassword, userUpdateValidation } from '~/middlewares/validate'

const router = Router()
const UserController1 = new UserController()

router.get('/', UserController1.home)
router.get('/reset-password', UserController1.getResetPassword)
router.post('/update', userUpdateValidation(), UserController1.update)
router.post('/reset-password', resetPassword(), UserController1.resetPassword)

export default router
