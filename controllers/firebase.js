'use strict'

var admin = require('firebase-admin')
var AdminAccount = require('../deone-sdk.json')

admin.initializeApp({
  credential: admin.credential.cert(AdminAccount),
  databaseURL: 'https://deone-1519430782017.firebaseio.com/'
})

exports.module = admin
