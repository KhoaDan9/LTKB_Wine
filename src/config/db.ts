import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export async function connect() {
  try {
    await mongoose.connect('mongodb://localhost:27017/' + process.env.DB_NAME)
    console.log('connect success')
  } catch (err) {
    console.log('connect error')
  }
}

module.exports = { connect }
