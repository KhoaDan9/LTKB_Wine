import express, { Request, Response } from 'express'
import { connect } from './config/db'
import route from './routes'
import bodyParser, { urlencoded } from 'body-parser'
import verifyToken from '../src/middlewares/auth'
import { engine } from 'express-handlebars'
import path from 'path'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
const methodOverride = require('method-override')
dotenv.config()

connect()
const app = express()

app.engine(
  '.hbs',
  engine({
    extname: '.hbs'
  })
)
app.set('view engine', '.hbs')
app.set('views', path.join(path.resolve('./src/resources'), 'views'))

app.use(cookieParser())
app.use(express.json())
app.use(urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.use(express.static(path.join(path.resolve('./src'), 'public')))

route(app)
// app.get('/welcome', (req: Request, res: Response) => {
//   res.render('login')
// })

// app.post('/welcome', verifyToken, (req: Request, res: Response) => {
//   res.render('home')
// })
const server = app.listen(process.env.PORT, () => {
  console.log(path.join(path.resolve('./src'), 'public'))

  console.log('server is running!!')
})
