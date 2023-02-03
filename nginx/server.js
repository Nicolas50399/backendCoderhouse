const express = require('express')
const app = express()

//app.use(express.static('public))

const PORT = parseInt(process.argv[2]) || 8081
const PORT2 = 8080


app.get('/api/randoms', (req, res) => {
    console.log(`port: ${PORT} -> Fyh: ${Date.now()}`)
    res.send(`Servidor express <span style="color:blueviolet;">(Nginx)</span> en ${PORT} - 
    <b>PID ${process.pid}</b> - ${new Date().toLocaleString()}`)
})

app.get('/', (req, res) => {
    //resto de las consultas
    res.send(`Servidor express <span style="color:blueviolet;">(Nginx)</span> en ${PORT2} - 
    <b>PID ${process.pid}</b> - ${new Date().toLocaleString()}`)
})

app.listen(PORT, err => {
    if(!err) console.log(`Servidor express escuchando en el puerto ${PORT} - PID WORKER ${process.pid}`)
})