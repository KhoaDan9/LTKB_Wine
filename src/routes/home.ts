import { Router } from 'express'
import verifyToken from '../middlewares/auth'

import { HomeController } from '../controllers/homeController'

const router = Router()
const HomeController1 = new HomeController()

router.get('/', verifyToken, HomeController1.welcome)

router.get('/logout', HomeController1.logout)

export default router
