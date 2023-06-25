import { Router } from 'express'

import { BillController } from '~/controllers/billController'

const router = Router()
const BillController1 = new BillController()

router.get('/', BillController1.getbill)

export default router
