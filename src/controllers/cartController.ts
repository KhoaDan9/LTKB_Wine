import { Product } from '~/models/product'
import { User } from '~/models/user'
import { Bill } from '~/models/bill'
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
      res.redirect('/cart')
    } catch (err) {
      res.send(err)
    }
  }

  async buyProduct(req: Request, res: Response) {
    try {
      const token = req.cookies['x-access-token']
      const user = await User.findOne({ token }).lean()
      if (!user) return res.send(403)
      const products = user.cart
      const actionItem = req.body.productsIds

      switch (req.body.action) {
        case 'buy':
          actionItem.forEach((id: any) => {
            const find = products.find((product) => product.id === id)
            if (find) {
              for (let i = 0; i < products.length; i++) {
                if (products[i].id == find.id) {
                  products.splice(i, 1)
                }
              }
              Bill.create({
                username: user.username,
                product_id: find.id,
                quantity: find.quantity
              })
            }
          })
          break
        case 'delete':
          actionItem.forEach((id: any) => {
            const find = products.find((product) => product.id === id)
            if (find) {
              for (let i = 0; i < products.length; i++) {
                if (products[i].id == find.id) {
                  products.splice(i, 1)
                }
              }
            }
          })
          break
        default:
          res.send('unknown action')
      }
      await User.updateOne({ token: token }, { $set: { cart: products } })
      res.redirect('back')
    } catch (err) {
      console.log('err: ' + err)
    }
  }

  async allPrice(req: Request, res: Response) {
    const token = req.cookies['x-access-token']
    const user = await User.findOne({ token })
    if (!user) return res.sendStatus(400)
    const cart = user.cart
    const allProducts = req.body.productsIds
    let sum: any = 0
    for (let i = 0; i < allProducts.length; i++) {
      const product = await Product.findById(allProducts[i])
      if (product) {
        const find = cart.find((cart_item) => cart_item.id === product.id)
        sum += product.price * find.quantity
      }
    }
    res.send({ sum })
  }

  async getbill(req: Request, res: Response) {
    try {
      const token = req.cookies['x-access-token']
      const user = await User.findOne({ token }).lean()
      if (!user) return res.send(403)
      const bill: product_data[] = user.buy
      const products: object[] = []
      let sum = 0
      for (let i = 0; i < bill.length; i++) {
        const product = await Product.findById(bill[i].id).lean()
        if (product) {
          const quantity = bill[i].quantity
          const summ = product.price * quantity
          const prod: any = product
          prod.quantity = quantity
          prod.summ = summ
          products.push(prod)
          sum += product.price * quantity
        }
      }
      res.render('bill', { products, user, sum })
    } catch (err) {
      res.send(err)
    }
  }
}
