import { Schema, model } from 'mongoose'

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    address: { type: String },
    phone: { type: String },
    role: { type: String, default: 'user' },
    token: { type: String }
  },
  { timestamps: true }
)

export const User = model('user', userSchema)
