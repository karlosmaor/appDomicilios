'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RegisterSchema = new Schema({
  worker: String,
  domiciliario: String,
  debt: Number,
  coins: Number,
  date: {type: Date, default: new Date()}
})


module.exports = mongoose.model('Register',RegisterSchema)
