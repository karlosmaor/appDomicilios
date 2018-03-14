var socket = io.connect('http://146.71.79.215:8030', {'forceNew': true})

socket.on('messages', function(data){
  console.log(data);
})
