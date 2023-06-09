import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'
dotenv.config()

const tokenKey = process.env.TOKEN_KEY as string

interface CustomRequest extends Request {
  user?: any
}

const verifyToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  // const token = req.body.token || req.query.token || req.headers['x-access-token']
  const token = req.cookies['x-access-token']
  if (!token) {
    if (req.path === '/') return res.render('home')
    else return res.render('login')

    // return res.status(403).send('A token is required for authentication')
  }
  try {
    const decoded = jwt.verify(token, tokenKey)
    req.user = decoded
  } catch (err) {
    res.render('home')
    // return res.status(401).send('Invalid Token')
  }
  return next()
}

export default verifyToken
