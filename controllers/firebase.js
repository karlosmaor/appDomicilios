'use strict'

var admin = require('firebase-admin')
var AdminAccount = require('../deone-sdk.json')
const config = require('../config')

admin.initializeApp({
  credential: admin.credential.cert(AdminAccount),
  databaseURL: 'https://deone-1519430782017.firebaseio.com/'
})

function SendNotificationDomiciliarios(tokens, delivery, tipo){

  var payload = {
    data: {
      title: "DeOne",
      body: "Esta es la notificación.",
      sound: "default",
      icon: "myicon",
      color: "#CDDC39",
      type: tipo,
      delivery: delivery
    }
  }

 var options = {
   prioity: "high",
   timeToLive: 60
 }

  admin.messaging().sendToTopic(tokens, payload, options)
  .then((response)=>{
    console.log(response)
  })
  .catch((error)=>{
    console.log(error)
  })
}

module.exports = {
  admin,
  SendNotificationDomiciliarios
}
