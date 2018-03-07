'use strict'

const Delivery =  require('../models/delivery')
const Client = require('../models/client')
const Domiciliario = require('../models/domiciliario')
const firebase = require('./firebase')

function getDelivery(req,res){
  let deliveryId = req.params.deliveryId

  Delivery.findById(deliveryId, (err, delivery) => {

    if(err) return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(!delivery) return res.status(404).send({message:'Esa entrega no existe'})

  res.status(200).send(delivery)
  })
}

function getDeliveries(req, res){
  Delivery.find({}, (err, deliveries)=>{
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

        firebase.SendNotificationDomiciliarios(["dimCtIKJ69U:APA91bE-6iHT7wwurw0egtmBIeZcHKg96IHlWbqYFlsoaSgN69vgUKThQAm40tv_uOlETtJau6xdo3mQF2Hbjy4GKFeoEceP2Hv8WidbuWNVH-m-RmuXL_mFyq8YLb9FQB3HVrRbQ1T9"],deliveryStored)
        res.status(200).send(deliveryStored)

      })
    })
  })
}

function updateDelivery(req,res){

  let deliveryId = req.params.deliveryId
  let update = req.body
  Delivery.findByIdAndUpdate(deliveryId, update,  (err, deliveryUpdated) =>{
    if(err) return res.status(500).send({message:`Error al editar la entrega de la base de datos ${err}`})

    Delivery.findById(deliveryUpdated._id, (err, deliveryNew)=>{
      if(err) return res.status(500).send(err)

      res.status(200).send(deliveryNew)
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
  Delivery.find(req.body, (err, deliveries)=>{
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

  Delivery.find({client: req.params.client, state: { $gt: 0, $lt: 3}}, 'domiciliario', (err, deliveries)=>{
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

module.exports ={
  getDelivery,
  getDeliveries,
  saveDelivery,
  updateDelivery,
  deleteDelivery,
  search,
  searchState,
  searchDeliveriesClient,
  GetDomiciliariosDeliveries
}
