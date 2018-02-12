'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')

//const ClientCtrl = require('../controllers/client')
const DeliveryCtrl  = require('../controllers/delivery')
const DomiciliarioCtrl  = require('../controllers/domiciliario')
const workerCtrl  = require('../controllers/worker')
/*
//----------------Rutas Cliente-------------//

api.get('/clients', ClientCtrl.getClients)
api.get('/client/:clientId', ClientCtrl.getClient)
api.post('/client', ClientCtrl.saveClient)
api.put('/client/:clientId', ClientCtrl.updateClient)
api.delete('/client/:clientId', ClientCtrl.deleteClient)*/

//---------------Rutas para entregas----------//

api.get('/deliveries', DeliveryCtrl.getDeliveries)
api.get('/delivery/:deliveryId', DeliveryCtrl.getDelivery)
api.post('/delivery', DeliveryCtrl.saveDelivery)
api.put('/delivery/:deliveryId', DeliveryCtrl.updateDelivery)
api.delete('/delivery/:deliveryId', DeliveryCtrl.deleteDelivery)

//--------------Rutas para domiciliario-------------//

api.get('/domiciliarios', DomiciliarioCtrl.getDomiciliarios)
api.get('/domiciliario/:domiciliarioId', DomiciliarioCtrl.getDomiciliario)
api.post('/domiciliario/signup', DomiciliarioCtrl.signUp)
api.post('/domiciliario/signin', DomiciliarioCtrl.signIn)
api.put('/domiciliario/:domiciliarioId', DomiciliarioCtrl.updateDomiciliario)
api.delete('/domiciliario/:domiciliarioId', DomiciliarioCtrl.deleteDomiciliario)

//----------------Rutas para worker--------------------//

api.get('/workers', workerCtrl.getWorkers)
api.get('/worker/:workerId', workerCtrl.getWorker)
api.post('/worker/signup', workerCtrl.signUp)
api.post('/worker/signin', workerCtrl.signIn)
api.put('/worker/:workerId', workerCtrl.updateWorker)
api.delete('/worker/:workerId', workerCtrl.deleteWorker)

/*api.get('/private', auth, function(req,res){
  res.status(200).send({message:'Tienes acceso'})
})*/

module.exports = api
