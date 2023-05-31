import { Application } from 'express'
import userRoute from './user'

function route(app: Application) {
  app.use('/auth', userRoute)
}

export default route
