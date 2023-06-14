import { Router } from 'express'
import { AdminController } from '~/controllers/adminController'

const router = Router()
const AdminController1 = new AdminController()
router.get('/', AdminController1.home)
router.get('/create', AdminController1.create)
router.post('/store', AdminController1.store)
router.get('/:id/edit', AdminController1.edit)
router.put('/:id', AdminController1.update)
export default router
