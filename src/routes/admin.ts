import { Router } from 'express'
import { AdminController } from '~/controllers/adminController'
import multer from 'multer'
import path from 'path'
import { storeValidation, storeVoucher, updateValidation } from '~/middlewares/validate'

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
const AdminController1 = new AdminController()

router.get('/', AdminController1.home)
router.get('/edit/:id', AdminController1.editView)
router.post('/edit', upload.single('imgUpload'), updateValidation(), AdminController1.edit)
router.get('/create', AdminController1.create)
router.post('/create', upload.single('imgUpload'), storeValidation(), AdminController1.store)
router.get('/delete/:id', AdminController1.delete)
router.get('/bill', AdminController1.bill)
router.get('/voucher', AdminController1.voucher)
router.get('/createvoucher', AdminController1.createVoucher)
router.get('/deletevoucher/:id', AdminController1.deleteVoucher)

router.get('/statistic', AdminController1.statistic)
router.post('/createstatistic', AdminController1.createStatistic)

router.get('/alluser', AdminController1.alluser)
router.get('/checkuser/:id', AdminController1.checkuser)
router.get('/check/:id', AdminController1.check)
router.get('/deny/:id', AdminController1.deny)

export default router
