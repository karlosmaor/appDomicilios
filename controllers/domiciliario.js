'use strict'

const mongoose = require('mongoose')
const Domiciliario = require('../models/domiciliario')
const service = require('../services')

function getDomiciliario(req,res){
  let domiciliarioId = req.params.domiciliarioId

  Domiciliario.findById(domiciliarioId, (err, domiciliario) => {
    console.log(err)
    if(err) return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(!domiciliario) return res.status(404).send({message:'El domiciliario no existe'})

  res.status(200).send({domiciliario})
  })
}

function getDomiciliarios(req, res){
  Domiciliario.find({}, (err, domiciliarios)=>{
    if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(domiciliarios.length == 0)return res.status(404).send({message:'No hay domiciliarios registrados'})

    res.status(200).send({ domiciliarios })
  })
}

function updateDomiciliario(req,res){
  let domiciliarioId = req.params.domiciliarioId
  let update = req.body

  Domiciliario.findByIdAndUpdate(domiciliarioId, update, (err, domiciliarioUpdated) =>{
    if(err) return res.status(500).send({message:`Error al editar el domiciliario en la base de datos ${err}`})

    if(update.password != ""){
      Domiciliario.findById(domiciliarioId, (err, dom)=>{
        if(err) return res.status(500).send(err)
        dom.password = update.password
        dom.save((err)=>{
          if(err) res.status(500).send(err)

        })
      })
    }
    res.status(200).send(domiciliarioUpdated)

  })

}

function deleteDomiciliario(req,res){
  let domiciliarioId = req.params.domiciliarioId
  Domiciliario.findById(domiciliarioId, (err, domiciliario) =>{
    if(err) return res.status(500).send({message:`Error al eliminar al domiciliario de la base de datos ${err}`})

    domiciliario.remove(err =>{
        if(err)return res.status(500).send({message:`Error al borrar el domiciliario de la base de datos ${err}`})
        res.status(200).send({message:'El domiciliario ha sido borrado.'})
    })
  })
}

function signUp(req,res){
  const domiciliario = new Domiciliario()
  domiciliario.email = req.body.email
  domiciliario.password = req.body.password
  domiciliario.name = req.body.name
  domiciliario.avatar = req.body.avatar
  domiciliario.phone = req.body.phone
  domiciliario.category = req.body.category

  Domiciliario.find({email: req.body.email}, (err,dom) =>{
    if(err) return res.status(500).send({message: err})

    if(dom.length != 0) return res.status(500).send({message: 'EL correo ya existe en nuestra base de datos'})

    domiciliario.save((err)=>{
      if(err) return res.status(500).send({message: `Error registrando nuevo domiciliario: ${err}`})

      res.status(201).send({token: service.createToken(domiciliario)})
    })

  })

}

function signIn(req,res){
  Domiciliario.findOne({email: req.body.email}, (err, domiciliario)=>{
    if(err) return res.status(500).send({message: err})
    if(!domiciliario) return re.status(404).send({
      message: 'No existe el usuario'
    })

    domiciliario.comparePass(req.body.password,(isMatch)=>{
      if(isMatch){
        res.status(200).send({
          token: service.createToken(domiciliario),
          domiciliario: domiciliario
        })
      }else {
        res.status(401).send({error: 'Contraseña incorrecta'})
      }
    })
  })
}


module.exports = {
  getDomiciliario,
  getDomiciliarios,
  deleteDomiciliario,
  updateDomiciliario,
  signUp,
  signIn
}
