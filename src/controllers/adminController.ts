import { NextFunction, Request, Response } from 'express'
import { User } from '../models/user'
import { Product } from '~/models/product'
import mongoose from 'mongoose'
import { error } from 'console'
const { mongooseToObject } = require('../util/mongoose')
export class AdminController {
  async home(req: Request, res: Response) {
    const product = await Product.find().lean()
    res.render('admin', { product, hideSearchBar: true })
  }
  create(req: Request, res: Response) {
    res.render('create')
  }
  store(req: Request, res: Response) {
    const formData = req.body;
    formData.image = `/img/${req.body.imgsrc}.jpg`
    const product = new Product(formData);
    product.save()
      .then(() => res.redirect('/admin'))
      .catch(error => {
        res.send(error)
      });
  }
  edit(req: Request, res: Response, next: NextFunction) {
    Product.findById(req.params.id)
      .then(product => res.render('edit', {
        product: mongooseToObject(product)
      }))
      .catch(next);
  }
  update(req: Request, res: Response, next: NextFunction) {
    Product.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.redirect('/admin'))
      .catch(next);
  }
} 