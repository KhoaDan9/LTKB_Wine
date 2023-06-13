import { User } from '~/models/user'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'

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
    const token = req.cookies['x-access-token']
    const user = await User.findOne({ token })
    const { newpassword1, newpassword2, oldpassword } = req.body
    const encryptedPassword = await bcrypt.hash(oldpassword, 10)

    const newencryptedPassword = await bcrypt.hash(req.body.newpassword1, 10)

    if (!user) return res.send(403)

    if (user.password != encryptedPassword)
      return res.render('resetpassword', { hideNavbar: true, hideSearchBar: true, errpassword: true })
    else if (newpassword1 != newpassword2)
      return res.render('resetpassword', { user, hideNavbar: true, hideSearchBar: true, wrongpassword: true })
    else {
      user.password = newencryptedPassword
    }
    await User.updateOne({token},{$set: {password: newencryptedPassword}})
    res.redirect('/logout')
  }

  async update(req: Request, res: Response) {
    const token = req.cookies['x-access-token']
    const user = await User.findOne({ token })
    const { fullname, address, phone } = req.body
    if (!user) res.send(403)
    else {
      user.fullname = fullname
      user.address = address
      user.phone = phone
      user.save()
    }
    res.redirect('back')
  }
}
