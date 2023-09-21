import { Schema, model } from 'mongoose'

const voucherSchema = new Schema(
  {
    name: { type: String, required: true },
    couponcode: { type: String, required: true },
    discount: { type: Number, required: true },
    quantity: { type: Number, required: true },
    starttime: { type: Date, required: true },
    endtime: { type: Date, required: true }
  },
  { timestamps: true }
)

export const Voucher = model('voucher', voucherSchema)
