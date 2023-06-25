import { Application } from 'express'
import userRoute from './user'
import adminRoute from './admin'
import authRoute from './auth'
import homeRoute from './home'
import productRoute from './product'
import cartRoute from './cart'
import billRoute from './bill'
function route(app: Application) {
  app.use('/auth', authRoute)
  app.use('/', homeRoute)
  app.use('/admin', adminRoute)
  app.use('/product', productRoute)
  app.use('/cart', cartRoute)
  app.use('/user', userRoute)
  app.use('/bill', billRoute)
}

export default route
