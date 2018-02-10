'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DeliveySchema = new Schema({
  client: String,
  domiciliario: String,
  addressStart: String,
  addressEnd: String,
  date: {type: Date, default: new Date()},
  category: String,
  state: {type:Number, default: 0}
})


module.exports = mongoose.model('Delivery',DeliveySchema)
