import { Schema, model } from 'mongoose'

const billSchema = new Schema(
  {
    bill_id: { type: Number, required: true },
    username: { type: String, required: true },
    fullname: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    note: { type: String },
    price: { type: Number, required: true },
    total_bill: { type: Number, required: true }
  },
  { timestamps: true }
)

export const Bill = model('bill', billSchema)
