'use strict'

const mongoose = require('mongoose')
const Client = require('../models/client')
const service = require('../services')

function getClient(req,res){
  let clientId = req.params.clientId

  Client.findById(clientId, (err, client) => {
    console.log(err)
    if(err) return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(!client) return res.status(404).send({message:'El Client no existe'})

  res.status(200).send(client)
  })
}

function getClients(req, res){
  Client.find({}, (err, clients)=>{
    if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(clients.length == 0)return res.status(404).send({message:'No hay Clients registrados'})

    res.status(200).send(clients)
  })
}

function updateClient(req,res){
  let clientId = req.params.clientId
  let update = req.body

  Client.findByIdAndUpdate(clientId, update, (err, clientUpdated) =>{
    if(err) return res.status(500).send({message:`Error al editar el Client en la base de datos ${err}`})

    if(update.password != undefined){

      Client.findById(clientId, (err, client)=>{
        if(err) return res.status(500).send(err)
        client.password = update.password
        client.save((err)=>{
          if(err) res.status(500).send(err)

        })
      })
    }
    res.status(200).send(clientUpdated)
  })
}

function deleteClient(req,res){
  let clientId = req.params.clientId
  Client.findById(clientId, (err, client) =>{
    if(err) return res.status(500).send({message:`Error al eliminar al Client de la base de datos ${err}`})

    client.remove(err =>{
        if(err)return res.status(500).send({message:`Error al borrar el Client de la base de datos ${err}`})
        res.status(200).send({message:'El Client ha sido borrado.'})
    })
  })
}

function signUp(req,res){
  const client = new Client()
  client.email = req.body.email
  client.password = req.body.password
  client.name = req.body.name
  client.avatar = req.body.avatar
  client.phone = req.body.phone
  client.address = req.body.address

  Client.find({email: req.body.email}, (err,clien) =>{
    if(err) return res.status(500).send({message: err})

    if(clien.length != 0) return res.status(500).send({message: 'EL correo ya existe en nuestra base de datos'})

    client.save((err)=>{
      if(err) return res.status(500).send({message: `Error registrando nuevo Client: ${err}`})

      res.status(201).send({token: service.createToken(client)})
    })
  })
}

function signIn(req,res){
  Client.findOne({email: req.body.email}, (err, client)=>{
    if(err) return res.status(500).send({message: err})
    if(!client) return re.status(404).send({
      message: 'No existe el usuario'
    })

    client.comparePass(req.body.password,(isMatch)=>{
      if(isMatch){
        res.status(200).send({
          token: service.createToken(client),
          client: client
        })
      }else {
        res.status(401).send({error: 'Contraseña incorrecta'})
      }
    })
  })
}


module.exports = {
  getClient,
  getClients,
  deleteClient,
  updateClient,
  signUp,
  signIn
}
