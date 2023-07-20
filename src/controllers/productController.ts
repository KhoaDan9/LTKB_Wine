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
      res.render('home')
    }
  }

  async addToCart(req: Request, res: Response) {
    try {
      const token = req.cookies['x-access-token']
      const user = await User.findOne({ token }).lean()
      if (!user) return res.render('loginrequire')
      const newProduct = {
        id: req.body.product_id,
        quantity: req.body.quantity
      }
      const product: any = await Product.findById(req.body.product_id).lean()
      if (product.quantity < req.body.quantity) return res.render('product', { user, product, isOutofStock: true })
      const cart: any[] = user.cart
      let isAdd = false
      if (cart.length != 0) {
        for (let i = 0; i < cart.length; i++) {
          if (cart[i].id == newProduct.id) {
            cart[i].quantity = Number(newProduct.quantity) + Number(cart[i].quantity)
            isAdd = true
            break
          }
        }
        if (!isAdd) cart.push(newProduct)
      } else cart.push(newProduct)
      await User.updateOne({ token: token }, { $set: { cart: cart } })
      res.redirect('back')
    } catch (err) {
      res.send(err)
    }
  }
}
