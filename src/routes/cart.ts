import { Router } from 'express'

import { CartController } from '~/controllers/cartController'

const router = Router()
const CartController1 = new CartController()

router.get('/', CartController1.allProducts)
router.post('/all-price', CartController1.allPrice)
router.get('/delete/:id', CartController1.deleteProduct)
router.post('/buy', CartController1.buyProduct)
router.post('/add', CartController1.addProduct)
router.post('/subtract', CartController1.subtractProduct)
router.post('/voucher', CartController1.addVoucher)

export default router
