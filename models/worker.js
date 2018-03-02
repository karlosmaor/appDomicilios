'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

const WorkerSchema = new Schema({
  email: {type: String, unique: true, required: true, lowercase: true},
  password: {type:String, select:false, required: true},
  name: String,
  id: {type: String, unique: true, required: true},
  avatar: String,
  phone: String,
  address: String,
  signupDate: {type: Date, default: Date.now()},
  lastLogin: Date,
  rank: Number
})

WorkerSchema.pre('save',function(next){
  let worker = this
  if(worker.password == undefined) return next()

  bcrypt.genSalt(10, (err,salt)=>{
    if(err) return next()

    bcrypt.hash(worker.password, salt, null, (err, hash)=>{
      if(err) return next(err)

      worker.password = hash
      next()
    })
  })
})

WorkerSchema.methods.comparePass = function (pass,isMatch) {
  mongoose.model('Worker', WorkerSchema).findOne({ email: this.email },'password', (err, worker) => {
        bcrypt.compare(pass, worker.password, function(err, res) {
          if (err)return console.log({ mensaje: err })
          isMatch(res)
        })
    })
}

module.exports = mongoose.model('Worker',WorkerSchema)
