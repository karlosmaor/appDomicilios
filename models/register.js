'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RegisterSchema = new Schema({
  worker: String,
  domiciliario: String,
  date: {type: Date, default: new Date()}
})


module.exports = mongoose.model('Register',RegisterSchema)
