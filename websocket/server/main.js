var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)

app.use('/static', express.static('../public'))

app.get('/hello', function(req,res){
  res.status(200).send('Hola Mundo')
})

io.on('connect',function(socket){
  console.log('Alguien se ha conectado con sockets');
})

server.listen(8030, function (){
  console.log('Servidor Websocket corriendo...');
})
