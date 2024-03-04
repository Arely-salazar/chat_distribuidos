//crear constante de express
const express = require("express");

//objeto de la aplicación
const app = express();

//establecer el path para las rutas
const path = require("path");

//crear constante para el http
const http = require("http");

//crear el servidor
const server = http.createServer(app);

//configurar el socket.oi
const {Server} = require("socket.io");

//crear instancia de Server
const io = new Server(server);


//establecer la ruta del index
app.get("/", (req, res)=> {
    res.sendFile(path.join(__dirname, 'cliente', 'index.html'));

});

// archivo css
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'cliente')));


//almacenar los nombres de usuario con sus ID de socket correspondientes
let usuariosConectados = {};

// eventos de conexión
io.on("connection", (socket) => {
    //nuevo usuario se conecta
    socket.on("set_clientes", (nombre) => {
        // guardar el nombre de usuario con su ID de socket
        usuariosConectados[socket.id] = nombre;
        // mstrar en la terminal que el usuario se ha conectado
        console.log("Usuario conectado:", nombre);
        // actualizar la lista de usuarios
        io.emit("usuariosConectados", Object.values(usuariosConectados));
        // mostrar que el usuario se ha unido al chat
        io.emit("mensaje", { mensaje: `${nombre} se ha unido`, nombre: "Sistema" });
    });

    // usuario se desconectado
    socket.on("disconnect", () => {
        //nombre de usuario asociado con el ID de socket
        const nombreDesconectado = usuariosConectados[socket.id];
        //elimina al usuario de la lista de usuarios conectados
        delete usuariosConectados[socket.id];
        //mostrar en la terminal que el usuario se ha desconectado
        console.log("Usuario desconectado:", nombreDesconectado);
        //actualizar la lista de usuarios conectados
        io.emit("usuariosConectados", Object.values(usuariosConectados));
        //mostrar que el usuario se ha desconectado
        io.emit("mensaje", { mensaje: `${nombreDesconectado} se ha desconectado`, nombre: "Sistema" });
    });

    //eventos de mensaje de texto
    socket.on("mensaje", (data)=>{
        //mostrar en la consola el mensaje de texto
        console.log("Mensaje reibido:", data.mensaje);
        //enviar el mensaje de texto al cliente
        io.emit("mensaje",{ mensaje: data.mensaje, nombre: data.nombre });
    });

    //eventos de imagenes en el servidor
    socket.on('imagen', (data) => {
        //mostrar en la consola la imagen
        console.log("Imagen reibido:", data.imagen);
        //enviar la imagen al cliente
        io.emit('imagen', data); 
    });
});

//escuchar puerto
server.listen(3000,"10.182.0.103",()=>{
    console.log("Servidor funcionando en http://10.182.0.103:3000");
});

//manejar errores app.use((err, req, res, next) => {
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(`¡Algo salió mal! ${err.message}`);
});


      
