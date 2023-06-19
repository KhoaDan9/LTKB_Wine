import { Router } from 'express'
import { AdminController } from '~/controllers/adminController'
import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('src/public/uploads'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })
const router = Router()
const AdminController1 = new AdminController()
router.get('/', AdminController1.home)
router.get('/create', AdminController1.create)
router.post('/create', upload.single('imgUpload'), AdminController1.store)
router.get('/:id/edit', AdminController1.edit)
router.put('/:id', upload.single('imgUpload'), AdminController1.update)
router.delete('/:id', AdminController1.destroy)
export default router
