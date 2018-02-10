'use strict'

const mongoose = require('mongoose')
const User = require('../models/user')
const service = require('../services')

function signUp(req,res){
  const user = new User({
    email: req.body.email,
    displayName: req.body.displayName,
    password: req.body.password
  })

  User.find({email: req.body.email}, (err,user2) =>{
    if(err) return res.status(500).send({message: err})

    if(user2.length != 0) return res.status(500).send({message: 'EL correo ya existe en nuestra base de datos'})

    user.save((err)=>{
      if(err) return res.status(500).send({message: `Error registrando nuevo usuario: ${err}`})

      res.status(201).send({token: service.createToken(user)})
    })

  })

}

function signIn(req,res){
  User.find({email: req.body.email}, (err, user)=>{
    if(err) return res.status(500).send({message: err})
    if(user.length == 0) return re.status(404).send({
      message: 'No existe el usuario',
      token: service.createToken(user)
    })

    req.user = user
    res.status(200).send({message: 'Te has logeado correctamente'})
  })
}

function getUsers(req,res){
  
}

module.exports = {
  signUp,
  signIn,
  getUsers
}
