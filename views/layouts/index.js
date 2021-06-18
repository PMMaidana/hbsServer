/* // inicializamos la conexion
const socket = io.connect();

// recibo desde el servidor un mensaje
socket.on('mensajes', mensajes => {
    console.log(mensajes);
    document.querySelector('p').innerHTML = mensajes.map(m => { return `id: ${m.socketId} mensaje: ${m.mensajes}`}).join('<br>')
    // TODO insertar el dato en el html
});

let title = document.querySelector('title');
let price = document.querySelector('price');
let thumbnail = document.querySelector('thumbnail');
const button = document.querySelector('button');

newProd = [title.value, price.value, thumbnail.value]

button.addEventListener('click', () => {
    console.log('evento click')
    socket.emit('mensaje', newProd)
})

// TODO obtener el input y emitir el mensaje cuando ocurra el evento de input en el html */