'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const hbs = require("express-handlebars")
const app =  express()
const api = require('../routes')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.engine('.hbs', hbs({
  default: 'default',
  extname: '.hbs'
}))
app.set('view engine','.hbs')

app.use('/domicilios',api)

app.get('/maps', function(req,res){
  res.render('map')
})

module.exports = app
