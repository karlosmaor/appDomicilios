var express = require('express')
var expressStatic = require('express-static')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)

var messages = [{
  id:1,
  texto:'Hola soy un mensaje',
  author:'Carlos Ortega'
}]

app.use(expressStatic('../appDomicilios/websocket/public'))

io.on('connection',function(socket){
  console.log('Alguien se ha conectado con sockets');

  socket.emit('messages', messages)

  socket.on('new-message', function(data){
    messages.push(data)
    io.sockets.emit('messages', messages)
  })
})

server.listen(8030, function (){
  console.log('Servidor Websocket corriendo...');
})
