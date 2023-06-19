const express = require('express');
const path = require('path');
const dotenv = require('dotenv').config()
const { Server: IOServer } = require('socket.io')
const { Server: HttpServer } = require('http');

const yargs = require('yargs/yargs')(process.argv.slice(2))
const args = yargs
    .default({ puerto: 8080, modo: 'FORK' }).argv

const PORT = process.argv[2] || args.puerto

const logger = require("./logger.js")

const router = require('./routes/ruteo')

//const MongoStore = require('connect-mongo')
//const DAOUsuarioMongo = require("./DB/daos/usuario/DAOUsuarioMongo.js")
//const MongoUsers = new DAOUsuarioMongo();
//const advancedOptions = { useNewUrlParser: process.env.USENEWURLPARSER, useUnifiedTopology: process.env.USEUNIFIEDTOPOLOGY }
const numCPUs = require('os').cpus().length

const { Router } = express;


switch (args.puerto) {
    case "FORK": {
        process.argv[3] = "FORK"
        require('child_process').spawn('node', ['session.js'])
    }
    case "CLUSTER": {
        //uso el modulo cluster
        process.argv[3] = "CLUSTER"
        const http = require('http')
        const cluster = require('cluster')
        
        if (cluster.isMaster) {
            for (let i = 0; i < numCPUs; i++) {
                cluster.fork()
            }

            cluster.on('exit', (worker, code, signal) => {
                console.log(`worker id: ${worker.process.pid} muerto`)
            })
        }
        else {
            http.createServer((req, res) => {
                res.writeHead(200)
                res.end('hola mundo')
            }).listen(8083)
            console.log(`worker id: ${worker.process.pid} iniciado`)
        }
    }
    default: { }
}


const app = express();

const httpServer = new HttpServer(app)

const io = new IOServer(httpServer)

app.use(express.static('views'))


app.use((req, res, next) => {
    logger.info(`Peticion ${req.method} en ${req.url}`)
    next()
})
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const handlebars = require("express-handlebars");
const { DBConnect } = require('./DB/controllers/usuarioController.js');
const { newMensaje } = require('./DB/services/mensajeServ.js');

app.set('views', './views/');

const hbs = handlebars.engine({
    extname: 'hbs',
    layoutsDir: './views/layouts/'
})

app.engine('hbs', hbs)

app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, "/views")))


app.use('/', router)

//*CREDENCIALES!!!!!


/*
app.use(
    session({
        store: MongoStore.create({
            mongoUrl: process.env.MONGOURL,
            mongoOptions: advancedOptions,
            ttl: process.env.TTL //*10 minutos
        }),
        secret: process.env.SECRET,
        resave: process.env.RESAVE,
        saveUninitialized: process.env.SAVEUNINITIALIZED
    }))
*/


const messages = []

io.on('connection', (socket) => {
    socket.emit('messages', messages)

    socket.on('new-message', data => {
        messages.push(data)
        newMensaje(data)
        io.sockets.emit('messages', messages)
    })
})



DBConnect(() => {
    httpServer.listen(PORT, () => logger.info(`Servidor escuchando en el puerto ${PORT}`));
})

