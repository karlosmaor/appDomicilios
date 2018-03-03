'use strict'

const Delivery =  require('../models/delivery')

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
  delivery.positionStart = req.body.positionStart
  delivery.positionEnd = req.body.positionEnd

  delivery.save((err, deliveryStored)=>{
    if(err){
      res.status(500).send({message :`Error al guardar la entrega en la base de datos: ${err}`})
    }
    res.status(200).send({delivery: deliveryStored})
  })
}

function updateDelivery(req,res){
  let deliveryId = req.params.deliveryId
  let update = req.body
  Delivery.findByIdAndUpdate(deliveryId, update,  (err, deliveryUpdated) =>{
    if(err) return res.status(500).send({message:`Error al editar la entrega de la base de datos ${err}`})
    res.status(200).send(deliveryUpdated)
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

function searchDelivery(req,res){
  let date1 = req.body.date1
  let date2 = req.body.date2
  Delivery.Find({
    date: {
      '$gte': new Timestamp(new Date(2018,3,1),0),
      '$lte': new Timestamp(new Date(2018,3,3),0)
    }
  },(err, deliveries) => {
    if(err)return res.status(500).send({message:`Error: ${err}`})

    if(deliveries.length == 0) return res.status(501).send({message:'No hay entregas'})

    res.status(200).send(deliveries)
  })
}

module.exports ={
  getDelivery,
  getDeliveries,
  saveDelivery,
  updateDelivery,
  deleteDelivery
}
