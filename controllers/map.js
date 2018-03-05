'use strict'

const mongoose = require('mongoose')
const Domiciliario = require('../models/domiciliario')
const service = require('../services')


function showDomiciliarios(req,res){
  Domiciliario.find({state: req.params.state}, (err, domiciliarios)=>{
    if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(domiciliarios.length == 0)return res.status(501).send({message:'No hay domiciliarios registrados'})
    res,status(200).send(domiciliarios)

  //  res.render('index.ejs',{doms: domiciliarios})
  })
}

function showDomiciliario(req,res){
  Domiciliario.find({_id: req.params.mapdata}, (err, domiciliarios)=>{
    if(err)return res.status(500).send({message:`Error al realizar la petición ${err}`})
    if(domiciliarios.length == 0)return res.status(501).send({message:'No hay domiciliarios registrados'})
    res,status(200).send(domiciliarios)
//    res.render('index.ejs',{doms: domiciliarios})
  })
}


module.exports = {
  showDomiciliarios,
  showDomiciliario
}
