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

  async search(req: Request, res: Response) {
    const token = req.cookies['x-access-token']
    const user = await User.findOne({ token }).lean()
    const search = req.query.query as string

    if (search == '') {
      const products = await Product.find().lean()
      res.render('home', { user, products })
    } else {
      const products = await Product.find({ $text: { $search: search } }).lean()
      if (products[0] == null) res.render('home', { user, name: search, notExists: true })
      else res.render('home', { user, products })
    }

    // res.send({user, products})
  }

  async search2(req: Request, res: Response) {
    const token = req.cookies['x-access-token']
    const user = await User.findOne({ token }).lean()
    const search = req.body.query as string
    const products = await Product.find({ $text: { $search: search } }).lean()
    // res.render('home', { user, products })
    res.send({ products })

    // res.send({user, products})
  }
  
  async productsType(req: Request, res: Response) {
    const token = req.cookies['x-access-token']
    const type = req.params.type
    const products = await Product.find({ type: type }).lean()
    const user = await User.findOne({ token }).lean()
    res.render('home', { user, products })
  }

  logout(req: Request, res: Response) {
    res.cookie('x-access-token', null, { expires: new Date(0) })
    res.redirect('/')
  }
}
