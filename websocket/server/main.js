var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)

server.listen(8030, function (){
  console.log('Servidor Websocket corriendo...');
})
