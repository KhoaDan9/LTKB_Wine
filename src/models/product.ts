import { Schema, model } from 'mongoose'

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    origin: { type: String },
    price: { type: Number, required: true },
    description: { type: String }
  },
  { timestamps: true }
)

export const Product = model('product', productSchema)
