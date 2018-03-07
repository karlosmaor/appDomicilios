'use strict'

var admin = require('firebase-admin')
var AdminAccount = require('../deone-sdk.json')

admin.initializeApp({
  credential: admin.credential.cert(AdminAccount),
  databaseURL: 'https://deone-1519430782017.firebaseio.com/'
})

function SendNotificationDomiciliarios(tokens){

  var payload = {
    data: {
      title: "DeOne",
      body: "Esta es la notificación.",
      sound: "default",
      icon: "myicon",
      color: "#CDDC39",
      type: 'delivery',
      delivery: 'cualquier cosa'
    }
  }

 var options = {
   prioity: "high",
   timeToLive: 60
 }

  admin.messaging().sendToDevice(tokens, payload, options)
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
