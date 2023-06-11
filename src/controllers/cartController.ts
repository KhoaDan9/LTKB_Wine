import { Product } from '~/models/product'
import { User } from '~/models/user'
import { Request, Response } from 'express'

export class CartController {
  async allProducts(req: Request, res: Response) {
    try{

    const token = req.cookies['x-access-token']
    const user = await User.findOne({ token }).lean()
    if (!user) return res.send(403)
    const cart: string[] = user.cart
    const products: object[] = []
    let sum = 0
    for (let i = 0; i < cart.length; i++) {
      const product = await Product.findById(cart[i]).lean()
      if (product) {
        products.push(product)
        sum += product.price
      }
    }
    res.render('cart', { products, user, sum })
  }
  catch (err) {
    res.send(err)
  }
}

  async deleteProduct(req: Request, res: Response) {
    try
    {

    const token = req.cookies['x-access-token']
    const user = await User.findOne({ token }).lean()
    const product_id = req.params.id
    if (!user) return res.send(403)
    const cart: string[] = user.cart
    for (let i = 0; i < cart.length; i++) {
      if (cart[i] == product_id) {
        cart.splice(i, 1)
        await User.updateOne({ token: token}, {$set: { cart: cart } })
        break
      }
    }
    res.redirect('back')
  }
  catch (err) {
    res.send(err)
  }
}

}
