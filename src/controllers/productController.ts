import { Product } from '~/models/product'
import { User } from '~/models/user'
import { Request, Response } from 'express'

export class ProductController {
  async show(req: Request, res: Response) {
    try {
      const token = req.cookies['x-access-token']
      const user = await User.findOne({ token }).lean()
      const product = await Product.findById(req.params.id).lean()
      res.render('product', { user, product })
    } catch (err) {
      // res.send(err)
      res.render('home')
    }
  }

  async addToCart(req: Request, res: Response) {
    try {
      const token = req.cookies['x-access-token']
      const user = await User.findOne({ token })
      if (!user) return res.send(403)
      const cart_array: string[] = user.cart
      cart_array.push(req.body.product_id)
      await User.updateOne({ token: token}, {$set: { cart: cart_array } })
      res.redirect('back')
    } catch (err) {
      res.send(err)
    }
  }
}
