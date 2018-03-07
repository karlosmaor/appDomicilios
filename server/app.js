'use strict'

const express = require('express')
const bodyParser = require('body-parser')
//const hbs = require("express-handlebars")
const app =  express()
const api = require('../routes')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use('/domicilios',api)

app.use('/static',express.static('../public'));
app.get('/image', function(req, res){
  res.sendFile('/home/carlosmaor2/appDomicilios/appDomicilios/public/images/marker1.png')
})

module.exports = app
