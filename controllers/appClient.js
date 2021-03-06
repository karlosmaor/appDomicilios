'use strict'

const mongoose = require('mongoose')
const Client = require('../models/client')
const Domiciliario = require('../models/domiciliario')
const Delivery =  require('../models/delivery')
const service = require('../services')
const config = require('../config')
const firebase = require('./firebase')

function signIn(req,res){
  Client.findOne({email: req.body.email}, (err, client)=>{
    if(err) return res.status(205).send({message: err})
    if(!client) return res.status(204).send({
      message: 'No existe el usuario'
    })

    client.comparePass(req.body.password,(isMatch)=>{
      if(isMatch){
        var update = {lastLogin:new Date()}
        Client.findByIdAndUpdate(client._id, update, (err, clientUpdated) =>{
          if(err) return res.status(205).send({message:`Error al editar el Client en la base de datos ${err}`})

          res.status(200).send({
            token: service.createToken(client),
            client: client
          })

        })
      }else {
        res.status(203).send({error: 'Contraseña incorrecta'})
      }
    })
  })
}

function getDomiciliario(req,res){
  let domiciliarioId = req.params.domiciliarioId

  Domiciliario.findById(domiciliarioId, (err, domiciliario) => {

    if(err) return res.status(205).send({message:`Error al realizar la petición ${err}`})
    if(!domiciliario) return res.status(204).send({message:'El domiciliario no existe'})

  res.status(200).send(domiciliario)
  })
}

function updateDelivery(req,res){

  let deliveryId = req.params.deliveryId
  let update = req.body
  if(req.body.positionStart != undefined) update.positionStart = JSON.parse(req.body.positionStart)
  if(req.body.positionEnd != undefined) update.positionEnd = JSON.parse(req.body.positionEnd)

  Delivery.findByIdAndUpdate(deliveryId, update,  (err, deliveryUpdated) =>{
    if(err) return res.status(205).send({message:`Error al editar la entrega de la base de datos ${err}`})
    if(deliveryUpdated == undefined) return res.status(204).send('No se encontró el pedido')

    Delivery.findById(deliveryUpdated._id).populate('client', 'name').exec((err, deliveryNew)=>{
      if(err) return res.status(205).send(err)

      if((deliveryUpdated.state == 0 && deliveryNew.state == 1)||(deliveryUpdated.state == 0 && deliveryNew.state == 4)) {
        var JsonDelivery = JSON.stringify(deliveryNew)
        firebase.SendNotificationDomiciliarios(config.state1,JsonDelivery, "delete")
      }
      if((deliveryUpdated.state == 1 && deliveryNew.state == 0)||(deliveryUpdated.state == 2 && deliveryNew.state == 0)) {
        var JsonDelivery = JSON.stringify(deliveryNew)
        firebase.SendNotificationDomiciliarios(config.state1,JsonDelivery, "add")
      }
      if (deliveryUpdated.state == 1 && deliveryNew.state == 2){
        Domiciliario.findByIdAndUpdate(deliveryNew.domiciliario,{state: 3},(err, domiciliarioUpdated)=>{
          if(err)return res.status(500).send(err)
          res.status(200).send(deliveryNew)
        })
      }else {
        res.status(200).send(deliveryNew)
      }
    })
  })
}

function searchDeliveriesClient(req, res){

  Delivery.find({client: req.body.client, state: { $gt: -1, $lt: 3}}, (err, deliveries)=>{
    if(err)return res.status(205).send({message:`Error al realizar la petición ${err}`})
    if(deliveries.length == 0)return res.status(204).send({message:'No hay entregas'})

    res.status(200).send(deliveries)
  })
}

function saveDelivery(req,res){

  let delivery = new Delivery()
  delivery.client = req.body.client
  delivery.domiciliario = req.body.domiciliario
  delivery.addressStart = req.body.addressStart
  delivery.addressEnd = req.body.addressEnd
  delivery.category = req.body.category
  delivery.state = req.body.state
  if(req.body.positionStart != undefined) delivery.positionStart = JSON.parse(req.body.positionStart)
  if(req.body.positionEnd != undefined) delivery.positionEnd = JSON.parse(req.body.positionEnd)
  delivery.phone = req.body.phone
  delivery.date = new Date()

  delivery.save((err, deliveryStored)=>{
    if(err)return res.status(205).send({message :`Error al guardar la entrega en la base de datos: ${err}`})
    let clientId = deliveryStored.client

    Client.findById(clientId, (err, client) => {

      if(err) return res.status(205).send({message:`Error al realizar la petición ${err}`})
      if(!client) return res.status(204).send({message:'El Client no existe'})
      client.deliveries.push(deliveryStored._id)
      client.save((err)=>{
        if(err)return res.status(205).send(err)

        Delivery.findById(deliveryStored._id).populate('client', 'name').exec((err, deliveryEnvio)=>{
          var JsonDelivery = JSON.stringify(deliveryEnvio)
          firebase.SendNotificationDomiciliarios(config.state1,JsonDelivery,"add")
          res.status(200).send(deliveryStored)
        })
      })
    })
  })
}

module.exports ={
  signIn,
  getDomiciliario,
  saveDelivery,
  updateDelivery,
  searchDeliveriesClient
}
