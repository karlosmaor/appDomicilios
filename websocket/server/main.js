var express = require('express')
var expressStatic = require('express-static')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)

var messages = [{
  id:1,
  texto:'Hola soy un mensaje',
  author:'Carlos Manuel Ortega Castillo'
}]

app.use(expressStatic('../appDomicilios/websocket/public'))

io.on('connection',function(socket){
  console.log('Alguien se ha conectado con sockets');

  socket.emit('messages', messages)

  socket.on('new-message', function(data){

    messages.push(data)

    enviarMensaje('messages', messages)
  })

  socket.on('unity', function(data){
    console.log(data)
  })
})

server.listen(8030, function (){
  console.log('Servidor Websocket corriendo...');
})

function enviarMensaje(id, mensaje){
  io.sockets.emit(id,mensaje)
}

module.exports = {
  io,
  server,
  enviarMensaje
}
