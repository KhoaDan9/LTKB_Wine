import { User } from '~/models/user'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'

export class UserController {
  async home(req: Request, res: Response) {
    const token = req.cookies['x-access-token']
    const user = await User.findOne({ token }).lean()
    res.render('user', { user })
  }

  async getResetPassword(req: Request, res: Response) {
    const token = req.cookies['x-access-token']
    const user = await User.findOne({ token }).lean()
    res.render('resetpassword', { user, hideNavbar: true, hideSearchBar: true })
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const token = req.cookies['x-access-token']
      const user = await User.findOne({ token })
      const { newpassword1, newpassword2, oldpassword } = req.body
      const errors = validationResult(req)
      if (!errors.isEmpty()) 
        res.render('resetpassword', { user, errors: errors.array()[0], hideNavbar: true, hideSearchBar: true })
      else if (oldpassword == newpassword1)
        res.render('resetpassword', { user, hideNavbar: true, hideSearchBar: true, password_same: true })
      else if (newpassword1 != newpassword2)
        res.render('resetpassword', { user, hideNavbar: true, hideSearchBar: true, password_wrong: true })
      else {
        if (!user) return res.send(403)
        else
        if (await bcrypt.compare(oldpassword, user.password)) {
          const encryptedPassword = await bcrypt.hash(newpassword1, 10)
          await User.updateOne({ token }, { $set: { password: encryptedPassword } })
          res.redirect('/logout')
        } else
         res.render('resetpassword', { hideNavbar: true, hideSearchBar: true, errpassword: true })
      }
    } catch (err) {
      'err' + err
    }
  }

  async update(req: Request, res: Response) {
    const token = req.cookies['x-access-token']
    const user = await User.findOne({ token })

    const { fullname, address, phone } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const return_user = await User.findOne({ token }).lean()
      res.render('user', { user: return_user, errors: errors.array()[0] })
    } else {
      if (!user) res.send(403)
      else {
        user.fullname = fullname
        user.address = address
        user.phone = phone
        user.save()
      }
      const return_user = await User.findOne({ token }).lean()
      res.render('user', { user: return_user, update: true })
    }
  }
}
