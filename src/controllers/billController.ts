import { Product } from '~/models/product'
import { User } from '~/models/user'
import { BillProduct } from '~/models/billProduct'
import { Bill } from '~/models/bill'
import { Request, Response, response } from 'express'
import { Voucher } from '~/models/voucher'

export class BillController {
  async getbill(req: Request, res: Response) {
    const token = req.cookies['x-access-token']
    const user = await User.findOne({ token }).lean()
    if (!user) return res.send(403)
    const bills = (await Bill.find({ username: user.username })).reverse()
    const showbills: any[] = []
    for (let i = 0; i < bills.length; i++) {
      showbills[i] = { bill_id: bills[i].bill_id }
      const billProduct: any = await BillProduct.find({ bill_id: bills[i].bill_id }).lean()
      for (let j = 0; j < billProduct.length; j++) {
        const product: any = await Product.findOne({ _id: billProduct[j].product_id })
        billProduct[j].product_name = product.name
        billProduct[j].product_imgsrc = product.imgsrc
        billProduct[j].sum = billProduct[j].price * billProduct[j].quantity
      }
      showbills[i].products = billProduct
      showbills[i].price = bills[i].price
      showbills[i].total = bills[i].total_bill
      showbills[i].fullname = bills[i].fullname
      showbills[i].address = bills[i].address
      showbills[i].phone = bills[i].phone
      showbills[i].note = bills[i].note
    }
    //res.send(showbills)
    res.render('bill', { user, showbills })
  }

  async order(req: Request, res: Response) {
    const token = req.cookies['x-access-token']
    const user = await User.findOne({ token }).lean()
    if (!user) return res.send(403)
    const { fullname, phone, address, note, quantity, productsIds, price, total_bill } = req.body
    // const voucher = req.body.voucher
    // const getVoucher = await Voucher.findOne({ couponcode: voucher })
    // console.log(voucher)
    // console.log('vxvcxvc')
    // console.log(typeof voucher)
    // console.log(getVoucher)
    const latest_bill = await Bill.find().limit(1).sort({ createdAt: -1 })
    const cart = user.cart
    let billID
    if (!latest_bill) billID = 100000
    else billID = latest_bill[0].bill_id + 1
    Bill.create({
      username: user.username,
      fullname,
      phone,
      address,
      note,
      bill_id: billID,
      price,
      total_bill
    })
    for (let i = 0; i < productsIds.length; i++) {
      for (let j = 0; j < cart.length; j++) {
        if (cart[j].id == productsIds[i]) cart.splice(j, 1)
      }
      const product: any = await Product.findById(productsIds[i])
      product.quantity = product.quantity - quantity[i]
      BillProduct.create({
        product_id: productsIds[i],
        quantity: quantity[i],
        bill_id: billID,
        price: product.price
      })
      await Product.findOneAndUpdate({ _id: productsIds[i] }, { quantity: product.quantity })
      // await Voucher.findOneAndUpdate({ couponcode: voucher }, { quantity: getVoucher.quantity - 1 })
    }
    await User.updateOne({ token: token }, { $set: { cart: cart } })

    res.redirect('/bill')
  }
}
