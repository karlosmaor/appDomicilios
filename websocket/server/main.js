var express = require('express')
var expressStatic = require('express-static')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)

app.use(expressStatic('../appDomicilios/websocket/public'))

app.get('/hello', function(req,res){
  res.status(200).send('Hola Mundo')
})

io.on('connection',function(socket){
  console.log('Alguien se ha conectado con sockets');
  
  socket.emit('messages', {
    id:1,
    text:'Hola soy un mensaje',
    author:'Carlos Ortega'
  })
})

server.listen(8030, function (){
  console.log('Servidor Websocket corriendo...');
})
