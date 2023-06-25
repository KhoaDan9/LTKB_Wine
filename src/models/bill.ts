import { Schema, model } from 'mongoose'

const billSchema = new Schema(
  {
    username: { type: String, required: true },
    product_id: { type: String, required: true },
    quantity: { type: Number, required: true }
  },
  { timestamps: true }
)

export const Bill = model('bill', billSchema)
