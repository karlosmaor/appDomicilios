'use strict'

const Delivery =  require('../models/delivery')
const Client = require('../models/client')
const Domiciliario = require('../models/domiciliario')
const firebase = require('./firebase')
const config = require('../config')

function getDelivery(req,res){
  let deliveryId = req.params.deliveryId

  Delivery.findById(deliveryId).populate('client', 'name').exec((err, delivery) => {

    if(err) return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(!delivery) return res.status(404).send({message:'Esa entrega no existe'})

  res.status(200).send(delivery)
  })
}

function getDeliveries(req, res){
  Delivery.find({}).populate('client', 'name').exec((err, deliveries)=>{
    if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(deliveries.length == 0)return res.status(501).send({message:'No hay entregas'})

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
    if(err)return res.status(500).send({message :`Error al guardar la entrega en la base de datos: ${err}`})
    let clientId = deliveryStored.client

    Client.findById(clientId, (err, client) => {

      if(err) return res.status(500).send({message:`Error al realizar la petición ${err}`})
      if(!client) return res.status(404).send({message:'El Client no existe'})
      client.deliveries.push(deliveryStored._id)
      client.save((err)=>{
        if(err)return res.status(500).send(err)

        Delivery.findById(deliveryStored._id).populate('client', 'name').exec((err, deliveryEnvio)=>{
          var JsonDelivery = JSON.stringify(deliveryEnvio)
          firebase.SendNotificationDomiciliarios(config.state1,JsonDelivery,"add")
          res.status(200).send(deliveryStored)
      })
    })
  })
}

function updateDelivery(req,res){

  let deliveryId = req.params.deliveryId
  let update = req.body
  if(req.body.positionStart != undefined) update.positionStart = JSON.parse(req.body.positionStart)
  if(req.body.positionEnd != undefined) update.positionEnd = JSON.parse(req.body.positionEnd)

  Delivery.findByIdAndUpdate(deliveryId, update,  (err, deliveryUpdated) =>{
    if(err) return res.status(500).send({message:`Error al editar la entrega de la base de datos ${err}`})
    if(deliveryUpdated == undefined) return res.status(404).send('No se encontró el pedido')

    Delivery.findById(deliveryUpdated._id).populate('client', 'name').exec((err, deliveryNew)=>{
      if(err) return res.status(500).send(err)

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

function deleteDelivery(req,res){
  let deliveryId = req.params.deliveryId
  Delivery.findById(deliveryId, (err, delivery) =>{
    if(err) return res.status(500).send({message:`Error al borrar la entrega de la base de datos ${err}`})

    delivery.remove(err =>{
        if(err)return res.status(500).send({message:`Error al borrar la entrega de la base de datos ${err}`})
        res.status(200).send({message:'La entrega ha sido borrada.'})
    })
  })
}

function search(req,res){
  let date1 = req.body.date1
  let date2 = req.body.date2

  Delivery.find({
    date: {
      '$gte': new Date(date1),
      '$lte': new Date(date2)
    }
  },(err, deliveries) => {
    if(err)return res.status(500).send({message:`Error: ${err}`})

    if(deliveries.length == 0) return res.status(501).send({message:'No hay entregas'})

    res.status(200).send(deliveries)
  })
}

function searchState(req, res){
  Delivery.find(req.body).populate('client', 'name').exec((err, deliveries)=>{
    if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(deliveries.length == 0)return res.status(501).send({message:'No hay entregas'})

    res.status(200).send(deliveries)
  })
}

function searchDeliveriesClient(req, res){

  Delivery.find({client: req.body.client, state: { $gt: -1, $lt: 3}}, (err, deliveries)=>{
    if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(deliveries.length == 0)return res.status(501).send({message:'No hay entregas'})

    res.status(200).send(deliveries)
  })
}

function GetDomiciliariosDeliveries(req, res){

  Delivery.find({client: req.params.client, state: { $gt: 0, $lt: 3}}, (err, deliveries)=>{
    if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(deliveries.length == 0)return res.status(501).send({message:'No hay entregas'})

    var idsDomiciliarios = new Array(deliveries.length)
    for(var i = 0; i < deliveries.length; i++){
      idsDomiciliarios[i] = deliveries[i].domiciliario
    }

    Domiciliario.find({_id: {$in: idsDomiciliarios}}, function(err, domiciliarios){
      if(err)return res.status(500).send(err)
      res.status(200).send(domiciliarios)
    })
  })
}

function StartDelivery(req,res){
  Delivery.findById(req.body.delivery).populate('client', 'name').exec((err, delivery) =>{
    if(err) return res.status(500).send({message:`Error buscando el pedido en la base de datos ${err}`})
    if(delivery.state != 0)return res.status(404).send('EL pedido fue asignado a otro domiciliario')
    if(delivery == null)return res.status(404).send('No se encontró la entrega')

    Domiciliario.findById(req.body.domiciliario, (err,domiciliario) =>{
      if(err) return res.status(500).send({message:`Error buscando al domiciliario en la base de datos ${err}`})
      if(domiciliario == null)return res.status(404).send('No se encontró al domiciliario')
      if(domiciliario.coins < 1)return res.status(402).send('No tienes suficientes puntos.')

      delivery.state = 1
      delivery.domiciliario = req.body.domiciliario
      domiciliario.state = 2
      var JsonDelivery = JSON.stringify(delivery)

      delivery.save((err)=>{
        if(err)return res.status(500).send(err)
        domiciliario.save((err)=>{
          if(err)return res.status(500).send(err)

          firebase.SendNotificationDomiciliarios(config.state1,JsonDelivery, "delete")
          res.status(200).send('Domiciliario y pedidos actualizados con éxito')
        })
      })
    })
  })
}

function DeliveryFinished(req,res){
  Delivery.findById(req.body.delivery, (err, delivery) =>{
    if(err) return res.status(500).send({message:`Error buscando el pedido en la base de datos ${err}`})
    if(delivery == null)return res.status(404).send('No se encontró la entrega')

    Domiciliario.findById(req.body.domiciliario, (err,domiciliario) =>{
      if(err) return res.status(500).send({message:`Error buscando al domiciliario en la base de datos ${err}`})
      if(domiciliario == null)return res.status(404).send('No se encontró al domiciliario')

      delivery.state = 3
      domiciliario.state = 1
      domiciliario.deliveries.push(delivery._id)
      domiciliario.coins = domiciliario.coins - 1

      delivery.save((err)=>{
        if(err)return res.status(500).send(err)
        domiciliario.save((err)=>{
          if(err)return res.status(500).send(err)

          res.status(200).send('Domiciliario y pedido actualizados con éxito')
        })
      })
    })
  })
}

module.exports ={
  getDelivery,
  getDeliveries,
  saveDelivery,
  updateDelivery,
  deleteDelivery,
  search,
  searchState,
  searchDeliveriesClient,
  GetDomiciliariosDeliveries,
  StartDelivery,
  DeliveryFinished
}
