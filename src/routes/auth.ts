import { Router } from 'express'
import { AuthController } from '../controllers/authController'
import multer from 'multer'
import path from 'path'
import { loginValidation, registerValidation } from '~/middlewares/validate'

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
const AuthController1 = new AuthController()

router.get('/login', AuthController1.islogin)

router.get('/register', AuthController1.isregister)

router.post('/register', upload.single('userid'), registerValidation(), AuthController1.register)

router.post('/login', loginValidation(), AuthController1.login)

export default router
