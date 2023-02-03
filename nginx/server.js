const yargs = require('yargs/yargs')(process.argv.slice(2))
const args = yargs
    .default({ puerto: 8080, modo: 'FORK' }).argv

const express = require('express')
const app = express()

//app.use(express.static('public))

const PORT = parseInt(process.argv[2]) || args.puerto

switch(PORT){
    case 8081:{
        //consultas a la ruta api/randoms
        app.get('/api/randoms', (req, res) => {
            console.log(`port: ${PORT} -> Fyh: ${Date.now()}`)
            res.send(`Servidor express <span style="color:blueviolet;">(Nginx)</span> en ${PORT} - 
            <b>PID ${process.pid}</b> - ${new Date().toLocaleString()}`)
        })
    }
    case 8080:{
        //resto de las consultas
        app.get('/', (req, res) => {
            res.send(`Servidor express <span style="color:blueviolet;">(Nginx)</span> en ${PORT} - 
            <b>PID ${process.pid}</b> - ${new Date().toLocaleString()}`)
        })
    }
    default: {}
}

app.listen(PORT, err => {
    if(!err) console.log(`Servidor express escuchando en el puerto ${PORT} - PID WORKER ${process.pid}`)
})