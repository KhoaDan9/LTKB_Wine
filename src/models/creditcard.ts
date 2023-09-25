import { Schema, model } from 'mongoose'

const creditcardSchema = new Schema(
  {
    username: { type: String, required: true },
    cardnumber: { type: Number, required: true },
    outofdate: { type: Date, required: true },
    CVV: { type: String, required: true },
    fullname: { type: String, required: true },
    address: { type: String, required: true },
    postalcode: { type: String, required: true }
  },
  { timestamps: true }
)

export const CreditCard = model('creditcard', creditcardSchema)
