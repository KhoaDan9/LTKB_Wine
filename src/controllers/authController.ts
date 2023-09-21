import { Request, Response } from 'express'
import { User } from '../models/user'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { validationResult } from 'express-validator'
dotenv.config()

const tokenKey = process.env.TOKEN_KEY as string

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { username, password1, password2, fullname, email, address, phone } = req.body

      const errors = validationResult(req)
      if (!errors.isEmpty())
        res.render('register', { hideNavbar: true, hideSearchBar: true, errors: errors.array()[0] })
      else if (password1 !== password2)
        res.render('register', { hideNavbar: true, hideSearchBar: true, password_wrong: true })
      else {
        const oldUser = await User.findOne({ username })
        if (oldUser) return res.render('register', { user_exists: true, hideNavbar: true, hideSearchBar: true })
        else {
          const encryptedPassword = await bcrypt.hash(password1, 10)
          const user = await User.create({
            username,
            password: encryptedPassword,
            fullname,
            email,
            address,
            phone
          })
          const token = jwt.sign({ user_id: user._id, username }, tokenKey, {
            expiresIn: '2h'
          })
          user.token = token
          user.save()

          res.redirect('/auth/login')
        }
      }
    } catch (err) {
      res.send('err' + err)
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body
      const options = {
        path: '/',
        sameSite: true,
        maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
        httpOnly: true // The cookie only accessible by the web server
      }

      const errors = validationResult(req)
      if (!errors.isEmpty()) res.render('login', { hideNavbar: true, hideSearchBar: true, errors: errors.array()[0] })
      else {
        const user = await User.findOne({ username })

        if (user && (await bcrypt.compare(password, user.password))) {
          const token = jwt.sign({ user_id: user._id, username }, tokenKey, {
            expiresIn: '2h'
          })

          user.token = token
          user.save()
          res.cookie('x-access-token', token, options)
          res.redirect('/')
        } else res.render('login', { incorrect: true, hideNavbar: true, hideSearchBar: true })
      }
    } catch (err) {
      res.send(err)
    }
  }

  islogin(req: Request, res: Response) {
    res.render('login', { hideNavbar: true, hideSearchBar: true, hideFooter: true })
  }

  isregister(req: Request, res: Response) {
    res.render('register', { hideNavbar: true, hideSearchBar: true, hideFooter: true })
  }
}
