
//establecer conexión con el socket.io
let socket = io();
            
//establecer variable para el nombre del usuario
let set_clientes;

//solicitar y almacenar el nombre del usuario
function pedirAlias(){
    set_clientes = prompt("Ingresa tu nombre:");
    if(!set_clientes){
        pedirAlias();
    } else {
        //Enviar el nombre de usario al server
        socket.emit('set_clientes', set_clientes);  
    }
}
pedirAlias();
  
function actualizarlistaU(usuario){
    const listausario = document.getElementById('lista-usuario');
    //Limpiar la lista de usuario
    listausario.innerHTML = '';
    //agregar cada usuario a la lista
    usuario.forEach(usuario => {
        const usuarioElemento = document.createElement('li');
        usuarioElemento.textContent = usuario;
        listausario.appendChild(usuarioElemento);
    });
}

//inicializar los emojis
$("#mensaje").emojioneArea();

//enviar mensajes
function enviarMensaje(){

    //obtener el mensaje y eliminar los espacios en blanco
    let mensaje = document.getElementById('mensaje').value; 
    
    //no enviar mensajes vacios
    if (mensaje !== '') { 
        
        socket.emit('mensaje', { mensaje: mensaje, nombre: set_clientes });

        //limpiar el input
       $('#mensaje').val('');
        var emojiArea =$("#mensaje").data("emojioneArea");
         if (emojiArea) {
            emojiArea.setText('');
         }
    }
}

//mensajes de texto recibidos del servidor
socket.on('mensaje', (data)=> {

    //muestra el mensaje en el drriv de chat
    var chatList = document.getElementById('chat-list');
    var nuevoMensaje = document.createElement('div');
    
     //agregar una clase dependiendo de si el mensaje es propio o del otro cliente
    nuevoMensaje.className = (data.nombre === set_clientes) ? 'mensaje-propio' : 'mensaje-otro';

    //mostrar el mensaje en el div
    nuevoMensaje.textContent = `${data.nombre}: ${data.mensaje}`;;
    chatList.appendChild(nuevoMensaje);
    //desplazar el chat para mostrar el ultimo mensaje
    nuevoMensaje.scrollIntoView();


});
//mensajes de imagenes
socket.on('imagen', (data) => {
    //mostrar imágenes en el chat
    const chatList = document.getElementById('chat-list');
    const nuevoMensaje = document.createElement('div');
    const imagen = document.createElement('img');
    imagen.src = data.imagen;
    nuevoMensaje.appendChild(imagen);
    chatList.appendChild(nuevoMensaje);
    //desplazar el chat para mostrar la nueva imagen
    imagen.scrollIntoView();
});

//evento para cuando se selecciona una imagen
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(event) {
        const imageData = event.target.result;
        //enviar la imagen al servidor
        socket.emit('imagen', { imagen: imageData });
    };
    
    reader.readAsDataURL(file);
});

