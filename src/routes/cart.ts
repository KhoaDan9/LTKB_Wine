import { Router } from 'express'

import { CartController } from '~/controllers/cartController'

const router = Router()
const CartController1 = new CartController()

router.get('/', CartController1.allProducts)
router.get('/delete/:id', CartController1.deleteProduct)

export default router
