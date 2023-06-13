import { Application } from 'express'
import authRoute from './auth'
import homeRoute from './home'
import productRoute from './product'
import cartRoute from './cart'
import userRoute from './user'

function route(app: Application) {
  app.use('/auth', authRoute)
  app.use('/', homeRoute)
  app.use('/product', productRoute)
  app.use('/cart', cartRoute)
  app.use('/user', userRoute)
}

export default route
