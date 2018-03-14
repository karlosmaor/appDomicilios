var socket = io.connect('http://146.71.79.215:8030', {'forceNew': true})

socket.on('messages', function(data){
  console.log(data);
  render(data)
})

function render(data){
  var html = data.map(function(elem,index){
    return(`<div>
                 <strong>${elem.author}</strong>:
                 <em>${elem.text}</em>
           </div>`)
  }).join(" ")

  document.getElementById('messages').innerHTML = html;
}

function addMessage(){
  var payload = {
    author: document.getElementById('username').value,
    texto: document.getElementById('texto'),value
  }
  console.log('entra');
  socket.emit('new-message', payload)
  return false
}
