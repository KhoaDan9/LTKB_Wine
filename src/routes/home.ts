import { Router } from 'express'
import verifyToken from '../middlewares/auth'

import { HomeController } from '../controllers/homeController'

const router = Router()
const HomeController1 = new HomeController()

router.get('/', HomeController1.welcome)
router.get('/search', HomeController1.search)
router.get('/:type', HomeController1.productsType)
router.post('/search2', HomeController1.search2)

router.get('/logout', HomeController1.logout)

export default router
