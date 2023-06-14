import { Router } from 'express'

import { ProductController } from '../controllers/productController'

const router = Router()
const ProductController1 = new ProductController()

router.get('/:id', ProductController1.show)
router.post('/add-to-cart', ProductController1.addToCart)
export default router
