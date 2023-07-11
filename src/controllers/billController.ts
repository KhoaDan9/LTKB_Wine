import { Product } from '~/models/product'
import { User } from '~/models/user'
import { Bill } from '~/models/bill'
import { Request, Response } from 'express'
import { format } from 'date-fns'

export class BillController {
  async getbill(req: Request, res: Response) {
    const token = req.cookies['x-access-token']
    const user = await User.findOne({ token }).lean()
    if (!user) return res.send(403)
    const arr: any[] = []
    let sum = 0
    //get date of all bill
    const bill2 = (await Bill.find({ username: user.username }).distinct('createdAt')).reverse()
    for (let i = 0; i < bill2.length; i++) {
      arr[i] = { date: format(bill2[i], 'dd/MM/yy HH:mm:ss') }
      const bill3: any = await Bill.find({ createdAt: bill2[i] }).lean()
      for (let j = 0; j < bill3.length; j++) {
        const product = await Product.findOne({ _id: bill3[j].product_id })
        if (!product) return res.send(403)
        bill3[j].product_name = product.name
        bill3[j].product_price = product.price * bill3[j].quantity
        bill3[j].product_imgsrc = product.imgsrc
        sum += bill3[j].product_price
      }
      arr[i].product = bill3
      arr[i].all_price = sum
      sum = 0
    }
    res.render('bill', { user, arr })
  }
}
