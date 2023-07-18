import { Request, Response } from 'express'
import { User } from '../models/user'
import { Product } from '~/models/product'

export class AdminController {
  async home(req: Request, res: Response) {
    const token = req.cookies['x-access-token']
    const user = await User.findOne({ token }).lean()
    if (!user) return res.status(400)
    if (user.role == false) res.redirect('auth/login')
    else {
      const products = await Product.find().lean()
      for(let i = 0; i < products.length; i++) {
      if(products[i].type == 'ruouvang')
        products[i].type = 'Rượu vang'
      else if (products[i].type == 'ruounhe')
        products[i].type = 'Rượu nhẹ'
      else if (products[i].type == 'ruoumanh')
        products[i].type = 'Rượu mạnh'
      else if (products[i].type == 'biavacider')
        products[i].type = 'Bia và cider'
      else if (products[i].type == 'phukien')
        products[i].type = 'Phụ kiện rượu'      
      }
     res.render('admin', { user, products, hideSearchBar: true })
    }
  }
  create(req: Request, res: Response) {
    res.render('create')
  }
  store(req: Request, res: Response) {
    const product = new Product({
      name: req.body.name,
      origin: req.body.origin,
      type: req.body.type,
      description: req.body.description,
      costprice: req.body.costprice,
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
  async editView(req: Request, res: Response) {
    const product = await Product.findById(req.params.id).lean()
    res.render('edit', {product})
  }

  async edit(req: Request, res: Response) {
    const { id, name, origin, quantity, type, description, costprice, price, imgUpload } = req.body
    await Product.findOneAndUpdate({_id : id},{name, origin, quantity, type, description, costprice, price, imgsrc: req.file?.filename || imgUpload})
    res.redirect('/admin')
  }
  
  update(req: Request, res: Response) {
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
      .catch()
  }
  destroy(req: Request, res: Response) {
    Product.deleteOne({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch()
  }
}
