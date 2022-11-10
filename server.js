const express = require('express');
const app = express();
const db = require("./main.js")
const productosRouter = require('./apirestful')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/productos', productosRouter)
app.use('/api/carrito', carritoRouter)

app.use("/", express.static(__dirname + "/public"));


const DB = new db();


app.get('/productos', async (req, res) => {
    const data = await DB.getAll();
    res.send(data);
});

app.get('/productoRandom', async (req, res) => {
    const longitudObjetos = (await DB.getAll()).length;
    const { id } = Math.random() * (longitudObjetos - 1) + 1;
    try {
        const data = await DB.getById(id);
        return res.send(data);
    }
    catch (e) {
        return res.status(404).send({ error: true, msg: e.message })
    }
});


//*-------------------------WEBSOCKETS---------------------------------------

const { Server: IOServer } = require('socket.io')
const { Server: HttpServer } = require('http')
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

app.use(express.static('./views/layouts'))

httpServer.listen(8081, function() {
    console.log('Servidor corriendo en http://localhost:8081')
})

io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado')
    socket.emit('productsList', productsList)

    socket.on('new-product', data => {
        productsList.push(data)
        io.sockets.emit('productsList', productsList)//Notifica a todos los sockets conectados
    })
})

productsList = DB.getAll();


app.listen(8080, () => {
    console.log("Servidor listo")
})