const express = require('express');
const crypto = require('crypto')

const bodyParser = require('body-parser')
const { Products } = require('./DB/controllers/productoController');




require('dotenv').config()
const yargs = require('yargs/yargs')(process.argv.slice(2))
const args = yargs
    .default({ puerto: 8080, modo: 'FORK' }).argv

const PORT = process.argv[2] || args.puerto

const compression = require('compression')


const logger = require("./logger.js")


const processRouter = require('./process')
const loginRouter = require('./routes/login')
const productsRouter = require('./routes/gestionProductos')
const cartRouter = require('./routes/gestionCarrito')

const MongoStore = require('connect-mongo')
//const DAOUsuarioMongo = require("./DB/daos/usuario/DAOUsuarioMongo.js")
//const MongoUsers = new DAOUsuarioMongo();
const advancedOptions = { useNewUrlParser: process.env.USENEWURLPARSER, useUnifiedTopology: process.env.USEUNIFIEDTOPOLOGY }
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

app.use((req, res, next) => {
    logger.info(`Peticion ${req.method} en ${req.url}`)
    next()
})
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./containers/ContenedorArchivos.js")
const DB = new db();



const handlebars = require("express-handlebars");
const { constants } = require('buffer');

app.set('views', './views/');

const hbs = handlebars.engine({
    extname: 'hbs',
    layoutsDir: './views/layouts/'
})

app.engine('hbs', hbs)

app.set('view engine', 'hbs');

app.use('/', processRouter)
app.use('/', loginRouter)
app.use('/', productsRouter)
app.use('/', cartRouter)

//middlewares

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





const { DBConnect, Users } = require('./DB/controllers/usuarioController')






//* AUTORIZACIONES

const auth = (req, res, next) => {
    if (req.session.usuario) {
        next();
    } else {
        res.redirect('/login')
    }
};
const adminAuth = (req, res, next) => {
    if (req.session.rank >= 1) {
        next();
    } else {
        res.status(401).send({ error: true });
    }
};

const authMW = (req, res, next) => {
    req.isAuthenticated() ? next() : res.send({error: true, msg: "no autenticado"})
}





//*REDIRIGIR DEPENDIENDO SI EXISTE SESION ACTIVA

app.get("/", (req, res) => {
    if (req.session.usuario) {
        res.redirect('/main')
    } else {
        res.redirect('/login')
    }

});

//* RUTAS GET (PAGINAS)

app.get('/main', auth, adminAuth, (req, res) => {
    try {
        //const data = await DB.getAll('productos.txt')
        Products.find({}, (err, products) => {
            console.log(products)
            if(err) logger.error("Error al cargar los productos: " + err)
            res.render('home', { layout: "productos", productos: products, name: req.session.usuario, mail: req.session.mail })
        }).lean()
        
    } catch (e) {
        logger.error(`Error en api de productos: ${e}`)
    }
})

app.get('/perfil', auth, adminAuth, (req, res) => {
    try {
        res.render('home', { 
            layout: "miPerfil", 
            name: req.session.usuario, 
            mail: req.session.mail,
            adress: req.session.direccion,
            phone: req.session.telefono,
            foto: req.session.foto
         })
    } catch (e) {
        logger.error(`Error en api de productos: ${e}`)
    }
})





app.get('/info', (req, res) => {
    if(process.argv[3] == "FORK"){
        console.log(`
        Argumentos de entrada: ${process.argv}
        Nombre plataforma: ${process.platform}
        Version Node: ${process.version}
        Memoria total reservada: ${process.memoryUsage()}
        Ruta de ejecucion: ${process.execPath}
        ID del proceso: ${process.pid}
        Carpeta de proyecto: ${process.cwd()}
        Numero de CPUS:: ${numCPUs}
    `)
    }

    res.render('home', {
        layout: "infoArgs",
        argsEntrada: process.argv,
        nombrePlataforma: process.platform,
        versionNode: process.version,
        memTotalRes: process.memoryUsage(),
        pathEjec: process.execPath,
        idProcess: process.pid,
        carpetaProy: process.cwd(),
        cpus: numCPUs
    });
})

app.get('/infoComprimido', compression(), (req, res) => {
    if(process.argv[3] == "FORK"){
        console.log(`
        Argumentos de entrada: ${process.argv}
        Nombre plataforma: ${process.platform}
        Version Node: ${process.version}
        Memoria total reservada: ${process.memoryUsage()}
        Ruta de ejecucion: ${process.execPath}
        ID del proceso: ${process.pid}
        Carpeta de proyecto: ${process.cwd()}
        Numero de CPUS:: ${numCPUs}
    `)
    }
    res.render('home', {
        layout: "infoArgs",
        argsEntrada: process.argv,
        nombrePlataforma: process.platform,
        versionNode: process.version,
        memTotalRes: process.memoryUsage(),
        pathEjec: process.execPath,
        idProcess: process.pid,
        carpetaProy: process.cwd(),
        cpus: numCPUs
    });
})



app.all("*", (req, res, next) => {
    const err = false
    if(err){
        logger.warn(`Peticion metodo: ${req.method}, url: ${req.url} a una ruta inexistente`)
        res.send({ error: true }).status(500)
    }
    next()
})


DBConnect(() => {
    app.listen(PORT, () => logger.info(`Servidor escuchando en el puerto ${PORT}`));
})
