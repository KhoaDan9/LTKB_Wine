import { Application } from 'express'
import userRoute from './user'
import homeRoute from './home'
import productRoute from './product'
import cartRoute from './cart'

function route(app: Application) {
  app.use('/auth', userRoute)
  app.use('/', homeRoute)
  app.use('/product', productRoute)
  app.use('/cart', cartRoute)
}

export default route
