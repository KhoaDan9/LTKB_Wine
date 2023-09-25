import { Schema, model } from 'mongoose'

const bankaccountSchema = new Schema(
  {
    username: { type: String, required: true },
    bankname: { type: String, required: true },
    bankbranch: { type: String, required: true },
    accountnumber: { type: Number, required: true },
    fullname: { type: String, required: true },
    userid: { type: String, required: true }
  },
  { timestamps: true }
)

export const BankAccount = model('bankaccount', bankaccountSchema)
