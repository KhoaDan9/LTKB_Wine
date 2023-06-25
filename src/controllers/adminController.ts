import { NextFunction, Request, Response } from 'express'
import { User } from '../models/user'
import { Product } from '~/models/product'
import mongoose from 'mongoose'
import { error } from 'console'
const { mongooseToObject } = require('../util/mongoose')
export class AdminController {
  async home(req: Request, res: Response) {
    const token = req.cookies['x-access-token']
    const user = await User.findOne({ token }).lean()
    if (!user) return res.status(400)
    if (user.role == false) res.redirect('auth/login')
    else {
      const product = await Product.find().lean()
      res.render('admin', { user, product, hideSearchBar: true })
    }
  }
  create(req: Request, res: Response) {
    res.render('create')
  }
  store(req: Request, res: Response) {
    // Product.updateOne({ _id: req.params.id }, {
    //   name: req.body.name,
    //   origin: req.body.origin,
    //   description: req.body.description,
    //   price: req.body.price,
    //   quantity: req.body.quantity,
    //   imgsrc: req.file?.filename || req.body.imgUpload,
    // })

    const product = new Product({
      name: req.body.name,
      origin: req.body.origin,
      type: req.body.type,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      imgsrc: req.file?.filename || req.body.imgUpload
    })
    product
      .save()
      .then(() => res.redirect('/admin'))
      .catch((error) => {
        res.send(error)
      })
  }
  edit(req: Request, res: Response, next: NextFunction) {
    Product.findById(req.params.id)
      .then((product) =>
        res.render('edit', {
          product: mongooseToObject(product)
        })
      )
      .catch(next)
  }
  update(req: Request, res: Response, next: NextFunction) {
    Product.updateOne(
      { _id: req.params.id },
      {
        name: req.body.name,
        origin: req.body.origin,
        type: req.body.type,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        imgsrc: req.file?.filename || req.body.imgUpload
      }
    )
      .then(() => res.redirect('/admin'))
      .catch(next)
  }
  destroy(req: Request, res: Response, next: NextFunction) {
    Product.deleteOne({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next)
  }
}
