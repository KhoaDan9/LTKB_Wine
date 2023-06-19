import { Router } from 'express'

import { CartController } from '~/controllers/cartController'

const router = Router()
const CartController1 = new CartController()

router.get('/', CartController1.allProducts)
router.get('/bill', CartController1.getbill)
router.post('/all-price', CartController1.allPrice)
router.get('/delete/:id', CartController1.deleteProduct)
router.post('/buy', CartController1.buyProduct)

export default router
