import { Router } from 'express'

import { BillController } from '~/controllers/billController'

const router = Router()
const BillController1 = new BillController()

router.get('/', BillController1.getbill)
router.post('/order', BillController1.order)
export default router
