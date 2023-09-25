import { Router } from 'express'

import { UserController } from '~/controllers/userController'
import { resetPassword, userUpdateValidation, forgotPassword, addCreditcard, addBankAccount } from '~/middlewares/validate'

const router = Router()
const UserController1 = new UserController()

router.get('/', UserController1.home)
router.get('/reset-password', UserController1.getResetPassword)
router.get('/forgot-password', UserController1.forgotPassword)
router.post('/update', userUpdateValidation(), UserController1.update)
router.post('/reset-password', resetPassword(), UserController1.resetPassword)
router.post('/send-mail', UserController1.sendMail)
router.post('/send-keypassword', UserController1.sendKeyPassword)
router.post('/set-newpassword', forgotPassword(), UserController1.setNewPassword)

router.get('/add-creditcard', UserController1.creditcard)
router.post('/add-creditcard', addCreditcard(), UserController1.addCreditCard)
router.get('/add-bankaccount', UserController1.bankaccount)
router.post('/add-bankaccount', addBankAccount(), UserController1.addBankAccount)

export default router
