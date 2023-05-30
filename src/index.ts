import express from 'express'
import { connect } from './config/db'
import route from './routes'
import bodyParser, { urlencoded } from 'body-parser'
import verifyToken from '../src/middlewares/auth'
connect()
const app = express()
app.use(urlencoded({ extended: true }))
app.use(bodyParser.json())

route(app)

app.post('/welcome', verifyToken, (req, res) => {
  res.status(200).send('Welcome 🙌 ')
})
const server = app.listen(8000, () => {
  console.log('server is running!!')
})
