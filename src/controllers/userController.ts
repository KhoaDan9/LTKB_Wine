import { User } from '~/models/user'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import nodemailer from 'nodemailer'
import randomstring from 'randomstring'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { CreditCard } from '~/models/creditcard'

const tokenKey = process.env.TOKEN_KEY as string

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
        else if (await bcrypt.compare(oldpassword, user.password)) {
          const encryptedPassword = await bcrypt.hash(newpassword1, 10)
          await User.updateOne({ token }, { $set: { password: encryptedPassword } })
          res.redirect('/logout')
        } else res.render('resetpassword', { hideNavbar: true, hideSearchBar: true, errpassword: true })
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

  forgotPassword(req: Request, res: Response) {
    res.render('forgotpassword', { hideNavbar: true, hideSearchBar: true, hideFooter: true })
  }

  async sendMail(req: Request, res: Response) {
    const { username, mail } = req.body
    const user: any = await User.findOne({ username: username }).lean()
    if (!user) {
      res.render('forgotpassword', { hideNavbar: true, hideSearchBar: true, hideFooter: true, wrongUser: true })
    } else if (user.email != mail) {
      res.render('forgotpassword', { hideNavbar: true, hideSearchBar: true, hideFooter: true, incorrect: true })
    } else {
      const randomUpperCaseString = randomstring.generate({
        length: 12,
        charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      })

      await User.updateOne({ username }, { $set: { forgotpassword: randomUpperCaseString } })

      const transport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'winemartbeto@gmail.com',
          pass: 'gkqp unxj nggs etkf'
        }
      })

      const mail_option = {
        from: 'winemartbeto@gmail.com',
        to: mail,
        subject: 'Mã khôi phục tài khoản WineMart',
        text: randomUpperCaseString
      }

      transport.sendMail(mail_option, (error: any, info: any) => {
        if (error) {
          console.log(error)
        } else {
          res.render('forgotPassword2', { user, hideNavbar: true, hideSearchBar: true, hideFooter: true })
        }
      })
    }
  }

  async sendKeyPassword(req: Request, res: Response) {
    const { username, keypassword } = req.body
    const user: any = await User.findOne({ username })
    const options = {
      path: '/',
      sameSite: true,
      maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
      httpOnly: true // The cookie only accessible by the web server
    }
    if (keypassword != user.forgotpassword) {
      res.render('forgotPassword', { wrongKeypassword: true, hideNavbar: true, hideSearchBar: true, hideFooter: true })
    } else {
      const token = jwt.sign({ user_id: user._id, username }, tokenKey, {
        expiresIn: '2h'
      })
      res.cookie('x-access-token', token, options)
      await User.updateOne({ username: user.username }, { $set: { token: token } })
      res.render('forgotPassword3', { hideNavbar: true, hideSearchBar: true, hideFooter: true })
    }
  }

  async setNewPassword(req: Request, res: Response) {
    const token = req.cookies['x-access-token']
    const user = await User.findOne({ token }).lean()
    const { newpassword1, newpassword2 } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.render('forgotPassword3', {
        errors: errors.array()[0],
        hideNavbar: true,
        hideSearchBar: true,
        hideFooter: true
      })
    } else {
      if (newpassword1 != newpassword2)
        res.render('forgotPassword3', {
          user,
          hideNavbar: true,
          hideSearchBar: true,
          password_wrong: true,
          hideFooter: true
        })
      else {
        if (!user) return res.send(403)
        const encryptedPassword = await bcrypt.hash(newpassword1, 10)
        await User.updateOne({ token }, { $set: { password: encryptedPassword } })
        res.redirect('/logout')
      }
    }
  }

  creditcard(req: Request, res: Response) {
    res.render('addcreditcard.hbs')
  }

  async addCreditCard(req: Request, res: Response) {
    try {
      const token = req.cookies['x-access-token']
      const user: any = await User.findOne({ token })

      const { cardnumber, outofdate, CVV, fullname, address, postalcode } = req.body
      const errors = validationResult(req)
      if (!errors.isEmpty()) res.render('addcreditcard', { errors: errors.array()[0] })
      else {
        await CreditCard.create({
          cardnumber,
          outofdate,
          fullname,
          CVV,
          address,
          postalcode,
          username: user.username
        })
        res.send('Them thanh cong!!!')
      }
    } catch (err) {
      console.log(err)
    }
  }
}
