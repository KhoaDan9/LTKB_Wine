import { Product } from '~/models/product'
import { User } from '~/models/user'
import { Request, Response } from 'express'

interface product_data {
  id: string
  quantity: number
}

export class CartController {
  async allProducts(req: Request, res: Response) {
    try {
      const token = req.cookies['x-access-token']
      const user = await User.findOne({ token }).lean()
      if (!user) return res.send(403)
      const cart: product_data[] = user.cart
      const products: object[] = []

      let sum = 0

      for (let i = 0; i < cart.length; i++) {
        const product = await Product.findById(cart[i].id).lean()
        if (product) {
          const quantity = cart[i].quantity
          const summ = product.price * quantity
          const prod: any = product
          prod.quantity = quantity
          prod.summ = summ
          products.push(prod)
          sum += product.price * quantity
        }
      }
      res.render('cart', { products, user, sum })
    } catch (err) {
      res.send(err)
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      const token = req.cookies['x-access-token']
      const user = await User.findOne({ token }).lean()
      const product_id = req.params.id
      if (!user) return res.send(403)
      const cart: product_data[] = user.cart
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].id == product_id) {
          cart.splice(i, 1)
          await User.updateOne({ token: token }, { $set: { cart: cart } })
          break
        }
      }
      res.redirect('back')
    } catch (err) {
      res.send(err)
    }
  }
}
