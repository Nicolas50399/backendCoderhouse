const express = require('express');
const app = express();
const db = require("./containers/ContenedorArchivos.js")
const productosRouter = require('./apirestful')
const carritoRouter = require('./apiCarrito')



app.use('/api/productos', productosRouter)
app.use('/api/carrito', carritoRouter)

//app.use("/", express.static(__dirname + "/public"));



/*
app.get('/productos', async (req, res) => {
    const data = await DB.getAll('productos.txt');
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
*/

app.use('views', './views/');

const bcrypt = require("bcrypt");
const handlebars = require("express-handlebars");
/*
const hbs = handlebars.engine({
    extname: "hbs",
    layoutsDir: "./views/layouts/",
})*/

app.set('views', path.join(__dirname, 'views'))

app.engine('.hbs', handlebars.engine({
    defaultLayout: 'indexHbs',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}))

app.set('view engine', '.hbs')


const DB = new db();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// * ---------------------FRONTEND-------------------------------------

app.get("/agregarProductos", (req, res) => {
    res.render("indexHbs", { layout: "agregarProductos" }); //*EN HANDLEBARS
});

app.get("/admin", async (req, res) => {
    const productos = await DB.getAll();
    //res.render("indexHbs", { layout: "productos", productos });//*EN HANDLEBARS
    res.send("xD2")
});

app.get("/producto/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const data = await DB.getById(id);
        res.render("indexHbs", { layout: "producto", ...data });//*EN HANDLEBARS
    } catch (e) {
        return res.status(404).render("indexHbs", { layout: "error" });//*EN HANDLEBARS
    }

    res.render("indexHbs", { layout: "productos", productos });//*EN HANDLEBARS
});

//*-------------------------REQUEST---------------------------------------


//*-------------------------WEBSOCKETS---------------------------------------

const { Server: IOServer } = require('socket.io')
const { Server: HttpServer } = require('http');
const path = require('path');
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

//productsList = DB.getAll('productos.txt');


app.listen(8080, () => {
    console.log("Servidor listo")
})