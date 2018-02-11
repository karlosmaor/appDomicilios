'use strict'

const jwt = require('jwt-simple')
const moment = require('moment')
const config = require('../config')
const bcrypt = require('bcrypt-nodejs')

function createToken(user){
  const payLoad = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14,'days').unix(),
  }

  return jwt.encode(payLoad,config.SECRET_TOKEN)

}

function decodeToken(token){
  const decoded = new Promise((resolve, reject)=>{
    try{
      const payLoad = jwt.decode(token, config.SECRET_TOKEN)

      if(payLoad.exp <= moment().unix()){
        reject({
          status: 401,
          message: 'El Token ha expirado'
        })
      }
      resolve(payLoad.sub)
    }catch(err){

      reject({
        status: 500,
        message: 'Invalid Token'
      })
    }
  })

  return decoded
}

function bcryptWord(word){
  console.log(word);
  bcrypt.genSalt(10, (err,salt)=>{
    if(err) return console.log(err)
    console.log(salt);

    bcrypt.hash(word, salt, null, (err, hash)=>{
      if(err) return console.log(err)
console.log(hash);
      return hash
    })
  })
}

module.exports = {
   createToken,
   decodeToken,
   bcryptWord
}
