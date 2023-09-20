import { Router } from 'express'

import { UserController } from '~/controllers/userController'
import { resetPassword, userUpdateValidation, forgotPassword } from '~/middlewares/validate'

const router = Router()
const UserController1 = new UserController()

router.get('/', UserController1.home)
router.get('/reset-password', UserController1.getResetPassword)
router.get('/forgot-password', UserController1.forgotPassword)
// router.get('/forgot-password2', UserController1.forgotPassword2)

router.post('/update', userUpdateValidation(), UserController1.update)
router.post('/reset-password', resetPassword(), UserController1.resetPassword)
router.post('/send-mail', UserController1.sendMail)
router.post('/send-keypassword', UserController1.sendKeyPassword)
router.post('/set-newpassword', forgotPassword(), UserController1.setNewPassword)



export default router
