'use strict'

const express = require('express')
const bodyParser = require('body-parser')
//const hbs = require("express-handlebars")
const app =  express()
const api = require('../routes')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use('/domicilios',api)

app.use(express.static(path.join(__dirname, 'public')));

module.exports = app
