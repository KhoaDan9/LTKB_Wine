import { Schema, model } from 'mongoose'

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    origin: { type: String },
    price: { type: Number, required: true },
    description: { type: String },
    quantity: { type: Number },
    type: { type: String },
    imgsrc: { type: String, required: true }
  },
  { timestamps: true }
)

export const Product = model('product', productSchema)