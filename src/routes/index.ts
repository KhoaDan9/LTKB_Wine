import { Application } from 'express'
import userRoute from './user'
import homeRoute from './home'
import productRoute from './product'
function route(app: Application) {
  app.use('/auth', userRoute)
  app.use('/', homeRoute)
  app.use('/product', productRoute)
}

export default route
