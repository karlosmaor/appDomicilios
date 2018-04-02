'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DeliverySchema = new Schema({
  client: {type: Schema.Types.ObjectId, ref: 'Client'},
  domiciliario: String,
  addressStart: String,
  addressEnd: String,
  date: {type: Date, default: new Date()},
  category: String,
  state: {type:Number, default: 0},
  phone: String,
  positionStart: {
    lat: {type: Number, default: 0.0},
    lng: {type: Number, default: 0.0}
  },
  positionEnd: {
    lat: {type: Number, default: 0.0},
    lng: {type: Number, default: 0.0}
  }
})


module.exports = mongoose.model('Delivery',DeliverySchema)
