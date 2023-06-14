import { Application } from 'express'
import userRoute from './user'
import homeRoute from './home'
import adminRoute from './admin'
function route(app: Application) {
  app.use('/auth', userRoute)
  app.use('/', homeRoute)
  app.use('/admin', adminRoute)
}

export default route