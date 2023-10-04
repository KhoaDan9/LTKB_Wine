import { Schema, model } from 'mongoose'

const billproductSchema = new Schema(
  {
    product_id: { type: String, required: true },
    quantity: { type: Number, required: true },
    bill_id: { type: String, required: true },
    price: { type: Number, required: true }
  },
  { timestamps: true }
)

export const BillProduct = model('billproduct', billproductSchema)
