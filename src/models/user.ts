import { Schema, model } from 'mongoose'

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    gender: { type: String, required: true },
    userid: { type: String },
    birth: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },

    forgotpassword: { type: String },
    role: { type: Boolean, default: false },
    token: { type: String },
    cart: { type: Array },
    buy: { type: Array }
  },
  { timestamps: true }
)

export const User = model('user', userSchema)
