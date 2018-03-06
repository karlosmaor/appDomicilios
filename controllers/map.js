'use strict'

const mongoose = require('mongoose')
const Domiciliario = require('../models/domiciliario')

function showDomiciliarios(req,res){
  if(req.params.mapdata.length > 3){
    var tipoR = 'single'
  }else{
    var tipoR = 'multiple'
  }
  res.render('index.ejs',{tipo: tipoR, datos: req.params.mapdata})
}


module.exports = {
  showDomiciliarios
}