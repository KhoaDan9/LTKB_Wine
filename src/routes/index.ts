import { Application } from 'express'
import userRoute from './user'
import homeRoute from './home'

function route(app: Application) {
  app.use('/auth', userRoute)
  app.use('/', homeRoute)
}

export default route
