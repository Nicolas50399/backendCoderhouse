const express = require('express');
const { fork } = require('child_process')
const numCPUs = require('os').cpus().length

const { Router } = express;

const router = Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/info', (req, res) => {
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

let cant = 600//100000000
let result = []

router.get('/api/randoms', (req, res) => {
    res.render('home', { layout: "generarNros", resultado: result });
})

router.post('/api/randoms', (req, res) => {
    const child = fork('./childs/generarRandoms.js')
    numeros = []
    if (req.query.cant) cant = req.query.cant

        child.on("message", (msg) => {
            console.log(`msg hijo:`, msg)
            result = msg
            child.kill()
        });
        
        child.send(cant);
        res.redirect('/api/randoms')
})

module.exports = router