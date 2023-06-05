import { Product } from '~/models/product'
import { User } from '~/models/user'
import { Request, Response } from 'express'

export class HomeController {
  // async welcome(req: Request, res: Response) {
  //   const token = req.query.token;
  //   const user = await User.findOne({ token })
  //   if (user == null) {
  //     res.render('home')
  //   }
  //   else {
  //     console.log(user.fullname);
  //     res.render('home')
  //   }
  // }

  welcome(req: Request, res: Response) {
    const token = req.cookies['x-access-token']
    User.findOne({ token })
      .lean()
      .then((user) => res.render('home', { user, isLogin: true }))
      .catch((err) => res.render('home'))
  }

  logout(req: Request, res: Response) {
    res.cookie('x-access-token', null, { expires: new Date(0) })

    res.redirect('/')
  }
}
