const express = require('express');
const app = express();
const db = require("../containers/ContenedorArchivos.js")

const { Router } = express;

const router = Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

const DB = new db();


const esAdmin = true;

const protegida = (req, res, next) => { //MIDDLEWARE QUE REVISA SI EL USUARIO ES ADMIN O NO
    if(esAdmin){
        next()
    }
    else{
        console.log("No es admin")
    }
}

//FUNCIONA!
router.get('/', async (req, res) =>{
    const data = await DB.getAll('productos.txt');
    return res.send(data);
})

//*DISPONIBLE PARA USUARIOS Y ADMINISTRADORES
//FUNCIONA!
router.get('/:id', async(req, res) => {

    const { id } = req.params;
    try{
        const data = await DB.getById(id, 'productos.txt');
        return res.send(data);
    }
    catch(e){
        return res.status(404).send({ error: true, msg: e.message })
    }
})

//*DISPONIBLE SOLO PARA ADMINISTRADORES
//FUNCIONA!!
router.post('/', protegida, async (req, res) => {
    const producto = req.body;

    try{
       const id = await DB.save(producto, 'productos.txt');

        return res.send({agregado: producto, id: id});
    }
    catch(e){
        return res.status(404).send({ error: true, msg: e.message })
    }
})

//FUNCIONA!!
router.put('/:id', protegida, async (req, res) => {
    const {id} = req.params;
    const producto = req.body;
    const productos = await DB.getAll('productos.txt');
    const ant = await DB.getById(id, 'productos.txt')
    const pos = productos.findIndex(p => JSON.stringify(p) === JSON.stringify(ant))
    

    
    const anterior = productos[pos];
    productos[pos] = producto;
    await DB.updateFile(productos, 'productos.txt')
    res.send({actualizado: producto, anterior: anterior})
    
})

//FUNCIONA!!
router.delete('/:id', protegida, async (req, res) => {
    const {id} = req.params;
    try{
        const eliminado = await DB.getById(id, 'productos.txt');
        await DB.deleteById(id, 'productos.txt');
        return res.send({eliminado: eliminado});
    }
    catch(e){
        return res.status(404).send({ error: true, msg: e.message });
    }
})

module.exports = router