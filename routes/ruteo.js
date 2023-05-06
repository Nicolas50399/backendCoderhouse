const express = require('express');

const { Router } = express;

const router = Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

const loginRouter = require('./login')
const productsRouter = require('./gestionProductos')
const cartRouter = require('./gestionCarrito')
const ordersRouter = require('./gestionPedidos');
const processRouter = require('./process')
const { getProductos } = require('../DB/controllers/productoController');
const logger = require('../logger');
const { auth } = require('./auths');
const compression = require('compression');


const numCPUs = require('os').cpus().length


router.use('/', loginRouter)
router.use('/', productsRouter)
router.use('/', cartRouter)
router.use('/', ordersRouter)
router.use('/', processRouter)

router.get("/", (req, res) => {
    if (req.session.usuario) {
        res.redirect('/main')
    } else {
        res.redirect('/login')
    }

});


router.get('/main', auth, getProductos)

router.get('/perfil', auth, (req, res) => {
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





router.get('/info', (req, res) => {
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

router.get('/infoComprimido', compression(), (req, res) => {
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



router.all("*", (req, res, next) => {
    const err = false
    if(err){
        logger.warn(`Peticion metodo: ${req.method}, url: ${req.url} a una ruta inexistente`)
        res.send({ error: true }).status(500)
    }
    next()
})

module.exports = router