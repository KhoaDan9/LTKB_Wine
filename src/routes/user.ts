import { Router } from 'express'

import { UserController } from '~/controllers/userController'
import {
  resetPassword,
  userUpdateValidation,
  forgotPassword,
  addCreditcard,
  addBankAccount
} from '~/middlewares/validate'
import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('src/public/uploads'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })
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
router.get('/add-userid', UserController1.userid)
router.post('/add-userid', upload.single('userid'), UserController1.addUserId)

export default router
