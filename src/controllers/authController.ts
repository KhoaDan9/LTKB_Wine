import { Request, Response } from 'express'
import { User } from '../models/user'
import bcrypt from 'bcrypt'
import jwt, { Secret } from 'jsonwebtoken'
import dotenv from 'dotenv'
// import {TOKEN_KEY as tokenKey} from '../type.d.ts'
dotenv.config()

const tokenKey = 'WINEKEYzzz'

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { username, password, fullname, address, phone } = req.body
      if (!(username && password && fullname)) {
        res.status(400).send('All input is required')
      }
      const oldUser = await User.findOne({ username })

      if (oldUser) {
        return res.status(409).send('User Already Exist. Please Login')
      }

      const encryptedPassword = await bcrypt.hash(password, 10)

      const user = await User.create({
        username,
        password: encryptedPassword,
        fullname,
        address,
        phone
      })

      // const token = jwt.sign({ user_id: user._id, username }, tokenKey, {
      //   expiresIn: '2h'
      // })
      // user.token = token
      // user.save()

      // return new user
      res.status(201).json(user)
    } catch (err) {
      console.log(err)
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body

      if (!(username && password)) {
        res.status(400).send('All input is required')
      }
      const user = await User.findOne({ username })

      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ user_id: user._id, username }, tokenKey, {
          expiresIn: '2h'
        })

        user.token = token
        user.save()
        res.status(200).json(user)
      } else res.status(400).send('Invalid Credentials')
    } catch (err) {
      console.log(err)
    }
  }

  home(req: Request, res: Response) {
    User.find({})
      .lean()
      .then((users) => res.json(users))
      .catch()
  }
}
