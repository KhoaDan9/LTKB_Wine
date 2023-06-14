import { Product } from '~/models/product'
import { User } from '~/models/user'
import { Request, Response } from 'express'

export class HomeController {
  async welcome(req: Request, res: Response) {
    try {
      const token = req.cookies['x-access-token']
      const products = await Product.find().lean()
      const user = await User.findOne({ token }).lean()
      res.render('home', { user, products })
    } catch (err) {
      res.send(err)
    }
  }

  logout(req: Request, res: Response) {
    res.cookie('x-access-token', null, { expires: new Date(0) })
    res.redirect('/')
  }
}
