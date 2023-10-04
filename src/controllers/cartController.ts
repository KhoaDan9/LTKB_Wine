import { Product } from '~/models/product'
import { User } from '~/models/user'
import { Request, Response } from 'express'
import { Voucher } from '~/models/voucher'

interface product_data {
  id: string
  quantity: number
}

export class CartController {
  async allProducts(req: Request, res: Response) {
    try {
      const token = req.cookies['x-access-token']
      const user = await User.findOne({ token }).lean()
      if (!user) return res.render('loginrequire')
      const cart: product_data[] = user.cart
      const products_show: object[] = []
      let sum = 0
      const outofStock: any = {}
      let isoutofStock = false
      for (let i = 0; i < cart.length; i++) {
        const product: any = await Product.findById(cart[i].id).lean()
        if (product) {
          const quantity = cart[i].quantity
          const summ = product.price * quantity
          const prod: any = product
          if (product.quantity < cart[i].quantity) {
            isoutofStock = true
            outofStock.name = product.name
            outofStock.quantity = product.quantity
          }
          prod.quantity = quantity
          prod.summ = summ
          products_show.push(prod)
          sum += product.price * quantity
        }
      }
      res.render('cart', { products_show, user, sum, outofStock, isoutofStock })
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
      const cart = user.cart
      const { price, voucher } = req.body
      let { price2 } = req.body
      if (!price2) price2 = price
      const actionItem = req.body.productsIds
      switch (req.body.action) {
        case 'buy': {
          const products_show: any[] = []
          for (let i = 0; i < actionItem.length; i++) {
            const product = await Product.findById(actionItem[i]).lean()
            if (product) {
              const find = cart.find((product) => product.id === actionItem[i])
              const prod: any = product
              prod.quantity = find.quantity
              prod.summ = find.quantity * product.price
              products_show.push(prod)
            }
          }
          return res.render('order', { user, products_show, price, price2, voucher })
        }

        case 'delete':
          actionItem.forEach((id: any) => {
            const find = cart.find((product) => product.id === id)
            if (find) {
              for (let i = 0; i < cart.length; i++) {
                if (cart[i].id == find.id) {
                  cart.splice(i, 1)
                }
              }
            }
          })
          break
        default:
          res.send('unknown action: ' + req.body.action)
      }
      await User.updateOne({ token: token }, { $set: { cart: cart } })
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

  async addProduct(req: Request, res: Response) {
    try {
      const token = req.cookies['x-access-token']
      const user = await User.findOne({ token }).lean()
      const product_id = req.body.productID
      if (!user) return res.send(403)
      const cart: product_data[] = user.cart
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === product_id) cart[i].quantity = Number(cart[i].quantity) + 1
      }
      await User.updateOne({ token: token }, { $set: { cart: cart } })
      //khong biet lam the nao de no khong load lai trang
      res.redirect('back')
    } catch (err) {
      res.send(err)
    }
  }

  async subtractProduct(req: Request, res: Response) {
    try {
      const token = req.cookies['x-access-token']
      const user = await User.findOne({ token }).lean()
      const product_id = req.body.productID
      if (!user) return res.send(403)
      const cart: product_data[] = user.cart
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === product_id) cart[i].quantity = Number(cart[i].quantity) - 1
      }
      await User.updateOne({ token: token }, { $set: { cart: cart } })
      //khong biet lam the nao de no khong load lai trang
      res.redirect('back')
    } catch (err) {
      res.send(err)
    }
  }

  async addVoucher(req: Request, res: Response) {
    const { voucher, price } = req.body
    const getVoucher = await Voucher.findOne({ couponcode: voucher })
    let voucherError
    if (!getVoucher) {
      voucherError = 'Voucher không tồn tại'
      res.send({ voucherError })
    } else if (getVoucher.endtime < new Date()) {
      voucherError = 'Voucher đã quá hạn sử dụng'
      res.send({ voucherError })
    } else {
      const sum = price - (price * getVoucher.discount) / 100
      res.send({ sum, voucher })
    }
  }
}
