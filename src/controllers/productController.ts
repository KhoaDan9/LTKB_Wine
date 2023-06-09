import { Product } from '~/models/product'
import { User } from '~/models/user'
import { Request, Response, NextFunction } from 'express'

export class ProductController {
  show(req: Request, res: Response) {
    const token = req.cookies['x-access-token']
    User.findOne({ token })
      .lean()
      .then((user) => {
        Product.findById(req.params.id)
          .lean()
          .then((product) => res.render('product', { user, product }))
          .catch((err) => res.send(err))
      })
      .catch((err) => res.render('login'))
  }

  async addToCart(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies['x-access-token']
    const user = await User.findOne({ token })
    if (!user) return res.send(403)
    const cart_array: string[] = user.cart
    cart_array.push(req.body.product_id)
    User.updateOne({ token: token, $set: { cart: cart_array } })
      .then(() => res.redirect('back'))
      .catch((err) => res.render('login'))
  }
}
