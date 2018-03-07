'use strict'

const express = require('express')
const api = express.Router()
const auth = require('../middlewares/auth')

const ClientCtrl = require('../controllers/client')
const DeliveryCtrl  = require('../controllers/delivery')
const DomiciliarioCtrl  = require('../controllers/domiciliario')
const workerCtrl  = require('../controllers/worker')
const RegisterCtrl = require('../controllers/register')
const MapCtrl = require('../controllers/map')

//----------------Rutas Cliente-------------//

api.get('/clients', ClientCtrl.getClients)
api.get('/client/:clientId', ClientCtrl.getClient)
api.post('/client/signup', ClientCtrl.signUp)
api.post('/client/signin', ClientCtrl.signIn)
api.post('/client/search', ClientCtrl.search)
api.post('/client/get/create', ClientCtrl.getCreate)
api.post('/client/:clientId', ClientCtrl.updateClient)
api.put('/client/:clientId', ClientCtrl.updateClient)
api.delete('/client/:clientId', ClientCtrl.deleteClient)

//---------------Rutas para entregas----------//

api.get('/deliveries', DeliveryCtrl.getDeliveries)
api.get('/delivery/:deliveryId', DeliveryCtrl.getDelivery)
api.post('/delivery', DeliveryCtrl.saveDelivery)
api.post('/delivery/search/deliveries/client', DeliveryCtrl.searchDeliveriesClient)
api.post('/delivery/buscar/fecha', DeliveryCtrl.search)
api.post('/delivery/search/state', DeliveryCtrl.searchState)
api.post('/delivery/:deliveryId', DeliveryCtrl.updateDelivery)
api.put('/delivery/:deliveryId', DeliveryCtrl.updateDelivery)
api.delete('/delivery/:deliveryId', DeliveryCtrl.deleteDelivery)

//--------------Rutas para domiciliario-------------//

api.get('/domiciliarios', DomiciliarioCtrl.getDomiciliarios)
api.get('/domiciliario/:domiciliarioId', DomiciliarioCtrl.getDomiciliario)
api.post('/domiciliario/signup', DomiciliarioCtrl.signUp)
api.post('/domiciliario/signin', DomiciliarioCtrl.signIn)
api.post('/domiciliario/search', DomiciliarioCtrl.search)
api.post('/domiciliario/:domiciliarioId', DomiciliarioCtrl.updateDomiciliario)
api.put('/domiciliario/:domiciliarioId', DomiciliarioCtrl.updateDomiciliario)
api.delete('/domiciliario/:domiciliarioId', DomiciliarioCtrl.deleteDomiciliario)

//----------------Rutas para worker--------------------//

api.get('/workers', workerCtrl.getWorkers)
api.get('/worker/:workerId', workerCtrl.getWorker)
api.post('/worker/signup', workerCtrl.signUp)
api.post('/worker/signin', workerCtrl.signIn)
api.post('/worker/search', workerCtrl.search)
api.post('/worker/:workerId', workerCtrl.updateWorker)
api.put('/worker/:workerId', workerCtrl.updateWorker)
api.delete('/worker/:workerId', workerCtrl.deleteWorker)

//---------------Rutas para registros----------//

api.get('/registers', RegisterCtrl.getRegisters)
api.get('/register/:registerId', RegisterCtrl.getRegister)
api.post('/register', RegisterCtrl.saveRegister)
api.post('/register/buscar/fecha', RegisterCtrl.search)
api.post('/register/search/state', RegisterCtrl.searchState)
api.post('/register/:registerId', RegisterCtrl.updateRegister)
api.put('/register/:registerId', RegisterCtrl.updateRegister)
api.delete('/register/:registerId', RegisterCtrl.deleteRegister)

//-----------------Rutas para mapas-----------------------------//

api.get('/maps/:mapdata',MapCtrl.showDomiciliarios)

/*api.get('/private', auth, function(req,res){
  res.status(200).send({message:'Tienes acceso'})
})*/

module.exports = api
