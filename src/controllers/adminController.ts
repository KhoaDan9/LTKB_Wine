import { Request, Response } from 'express'
import { User } from '../models/user'
import { Product } from '~/models/product'
import { Bill } from '../models/bill'
import { BillProduct } from '~/models/billProduct'
import { Voucher } from '~/models/voucher'

import * as fs from 'fs'
import path from 'path'
import { validationResult } from 'express-validator'

export class AdminController {
  async home(req: Request, res: Response) {
    const token = req.cookies['x-access-token']
    const user = await User.findOne({ token }).lean()
    if (!user) return res.status(400)
    if (user.role == false) res.redirect('auth/login')
    else {
      const products = await Product.find().lean()
      for (let i = 0; i < products.length; i++) {
        if (products[i].type == 'ruouvang') products[i].type = 'Rượu vang'
        else if (products[i].type == 'ruounhe') products[i].type = 'Rượu nhẹ'
        else if (products[i].type == 'ruoumanh') products[i].type = 'Rượu mạnh'
        else if (products[i].type == 'biavacider') products[i].type = 'Bia và cider'
        else if (products[i].type == 'phukien') products[i].type = 'Phụ kiện rượu'
      }
      res.render('admin', { user, products, hideSearchBar: true, hideFooter: true })
    }
  }

  create(req: Request, res: Response) {
    res.render('create', { hideFooter: true })
  }

  async store(req: Request, res: Response) {
    try {
      const { name, origin, quantity, type, description, costprice, price } = req.body
      const errorImg: any = []
      if (!req.file?.filename) errorImg.push('Yêu cầu nhập hình ảnh')
      else {
        const allowedExtensions = ['.png'] // Các đuôi file được cho phép
        const fileExtension = path.extname(req.file.originalname).toLowerCase()
        if (!allowedExtensions.includes(fileExtension)) {
          errorImg.push('Định dạng tệp tin không hợp lệ. Chỉ chấp nhận đuôi ".png"')
        }
        // Kiểm tra kích thước ảnh (kích thước tính bằng byte)
        if (req.file.size > 5 * 1024 * 1024) {
          errorImg.push('Kích thước ảnh không được vượt quá 5MB')
        }
      }
      if (errorImg.length != 0) res.render('create', { errorsImg: errorImg[0], hideFooter: true })
      else {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
          res.render('create', { errors: errors.array()[0], hideFooter: true })
        } else {
          if (parseFloat(costprice) > parseFloat(price)) {
            const errorsPrice = 'Giá nhập không được lớn hơn giá bán!!'
            res.render('create', { errorsPrice, hideFooter: true })
          } else {
            await Product.create({
              name,
              origin,
              quantity,
              type,
              description,
              costprice,
              price,
              imgsrc: req.file?.filename
            })
            res.redirect('back')
          }
        }
      }
    } catch (err) {
      res.send('err' + err)
    }
  }

  async editView(req: Request, res: Response) {
    const product = await Product.findById(req.params.id).lean()
    res.render('edit', { product, hideFooter: true })
  }

  async edit(req: Request, res: Response) {
    const { _id, quantity, costprice, price } = req.body
    const product = await Product.findById(_id).lean()
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.render('edit', { product, errors: errors.array()[0], hideFooter: true })
    } else {
      if (parseFloat(costprice) > parseFloat(price)) {
        const errorsPrice = 'Giá nhập không được lớn hơn giá bán!!'
        res.render('edit', { product, errorsPrice, hideFooter: true })
      } else {
        await Product.findOneAndUpdate({ _id: _id }, { quantity, costprice, price })
        res.redirect('/admin')
      }
    }
  }

  async delete(req: Request, res: Response) {
    const product = await Product.findOneAndDelete({ _id: req.params.id })
    fs.unlink(path.dirname(__dirname) + '/public/uploads/' + product?.imgsrc, (err) => {
      if (err) throw err
    })
    res.redirect('back')
  }

  async bill(req: Request, res: Response) {
    const bills = (await Bill.find()).reverse()
    const showbills: any[] = []
    for (let i = 0; i < bills.length; i++) {
      showbills[i] = { bill_id: bills[i].bill_id }
      const billProduct: any = await BillProduct.find({ bill_id: bills[i].bill_id }).lean()
      let sum = 0
      for (let j = 0; j < billProduct.length; j++) {
        const product: any = await Product.findOne({ _id: billProduct[j].product_id })
        billProduct[j].product_name = product.name
        billProduct[j].product_imgsrc = product.imgsrc
        billProduct[j].product_price = product.price
        billProduct[j].sum = product.price * billProduct[j].quantity
        sum += billProduct[j].sum
      }
      showbills[i].products = billProduct
      showbills[i].total = sum
      showbills[i].fullname = bills[i].fullname
      showbills[i].address = bills[i].address
      showbills[i].phone = bills[i].phone
      showbills[i].note = bills[i].note
      sum = 0
    }
    //res.send(showbills)
    res.render('bill', { showbills, hideSearchBar: true, hideFooter: true, hideNavbar: true })
  }

  async voucher(req: Request, res: Response) {
    res.render('bill', { hideSearchBar: true, hideFooter: true, hideNavbar: true })
  }
}
