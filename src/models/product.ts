import { Schema, model } from 'mongoose'

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    origin: { type: String },
    price: { type: Number, required: true },
    costprice: { type: Number, required: true },
    type: { type: String, required: true },
    description: { type: String },
    quantity: { type: Number },
    imgsrc: { type: String, required: true }
  },
  { timestamps: true }
)

productSchema.index({ name: 'text' })

export const Product = model('product', productSchema)
