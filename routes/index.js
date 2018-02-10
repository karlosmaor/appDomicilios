'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middleswares/auth')

const ProductCtrl = require('../controles/product')
const UserCtrl  = require('../controles/user')

api.get('/product', ProductCtrl.getProducts)
api.get('/product/:productId', ProductCtrl.getProduct)
api.post('/product', ProductCtrl.saveProduct)
api.put('/product/:productId', ProductCtrl.updatePoduct)
api.delete('/product/:productId', ProductCtrl.deleteProduct)
api.get('/allusers', UserCtrl.getUsers)
api.post('/signup', UserCtrl.signUp)
api.post('/signin', UserCtrl.signIn)
api.get('/private', auth, function(req,res){
  res.status(200).send({message:'Tienes acceso'})
})

module.exports = api
