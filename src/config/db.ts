import mongoose from 'mongoose'

export async function connect() {
  try {
    await mongoose.connect('mongodb://localhost:27017/Winemart')
    console.log('connect success')
  } catch (err) {
    console.log('connect error')
  }
}

module.exports = { connect }
