'use strict'

const mongoose = require('mongoose')
const Worker = require('../models/worker')
const service = require('../services')

function getWorker(req,res){
  let workerId = req.params.workerId

  Worker.findById(workerId, (err, worker) => {

    if(err) return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(!worker) return res.status(404).send({message:'El Worker no existe'})

  res.status(200).send(worker)
  })
}

function getWorkers(req, res){
  Worker.find({}, (err, workers)=>{
    if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(workers.length == 0)return res.status(501).send({message:'No hay Workers registrados'})

    res.status(200).send(workers)
  })
}

function updateWorker(req,res){
  let workerId = req.params.workerId
  let update = req.body

  Worker.findByIdAndUpdate(workerId, update, (err, workerUpdated) =>{
    if(err) return res.status(500).send({message:`Error al editar el Worker en la base de datos ${err}`})

    if(update.password != undefined){

      Worker.findById(workerId, (err, worker)=>{
        if(err) return res.status(500).send(err)
        worker.password = update.password
        worker.save((err)=>{
          if(err) res.status(500).send(err)

        })
      })
    }
    res.status(200).send(workerUpdated)
  })
}

function deleteWorker(req,res){
  let workerId = req.params.workerId
  Worker.findById(workerId, (err, worker) =>{
    if(err) return res.status(500).send({message:`Error al eliminar al Worker de la base de datos ${err}`})

    worker.remove(err =>{
        if(err)return res.status(500).send({message:`Error al borrar el Worker de la base de datos ${err}`})
        res.status(200).send({message:'El Worker ha sido borrado.'})
    })
  })
}

function signUp(req,res){
  const worker = new Worker()
  worker.email = req.body.email
  worker.password = req.body.password
  worker.name = req.body.name
  worker.phone = req.body.phone
  worker.address = req.body.address
  worker.rank = req.body.rank
  worker.id = req.body.id
  worker.signupDate = new Date()

  Worker.find({email: req.body.email}, (err,wor) =>{
    if(err) return res.status(500).send({message: err})

    if(wor.length != 0) return res.status(501).send({message: 'EL correo ya existe en nuestra base de datos'})

    Worker.find({id: req.body.id}, (err,wor) =>{
      if(err) return res.status(500).send({message: err})

      if(wor.length != 0) return res.status(502).send({message: 'EL numero de cédula ya existe en nuestra base de datos'})

      worker.save((err)=>{
        if(err) return res.status(500).send({message: `Error registrando nuevo Worker: ${err}`})

        res.status(201).send({token: service.createToken(worker)})
      })
    })
  })
}

function signIn(req,res){
  Worker.findOne({email: req.body.email}, (err, worker)=>{
    if(err) return res.status(500).send({message: err})
    if(!worker) return res.status(404).send({
      message: 'No existe el usuario'
    })

    worker.comparePass(req.body.password,(isMatch)=>{
      if(isMatch){
        res.status(200).send({
          token: service.createToken(worker),
          worker: worker
        })
      }else {
        res.status(401).send({error: 'Contraseña incorrecta'})
      }
    })
  })
}

function search(req, res){
  Worker.find(req.body, (err, workers)=>{
    if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(workers.length == 0)return res.status(501).send({message:'No hay workers registrados'})

    res.status(200).send( workers )
  })
}


module.exports = {
  getWorker,
  getWorkers,
  deleteWorker,
  updateWorker,
  signUp,
  signIn,
  search
}
