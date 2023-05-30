import { Application, Response, Request } from 'express'
import userRoute from './user'

function route(app: Application) {
  app.use('/auth', userRoute)
}

export default route
