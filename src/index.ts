import express, { Request, Response } from 'express'
import { connect } from './config/db'
import route from './routes'
import bodyParser, { urlencoded } from 'body-parser'
import verifyToken from '../src/middlewares/auth'
import { engine } from 'express-handlebars'
import path from 'path'

connect()
const app = express()

app.engine('.hbs',engine({
  extname : '.hbs'
}));
app.set('view engine','.hbs');
app.set('views',path.join(__dirname,'views'));


app.use(urlencoded({ extended: true }))
app.use(bodyParser.json())

route(app)

app.get('/welcome', (req: Request, res: Response) => {
  res.render('home')
})

// app.post('/welcome', verifyToken, (req: Request, res: Response) => {
//   res.render('home')
// })
const server = app.listen(8000, () => {
  console.log(path.join(__dirname,'views'))
  console.log('server is running!!')
})
