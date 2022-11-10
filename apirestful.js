const express = require('express');
const app = express();
const db = require("./main.js")

const { Router } = express;

const router = Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

const DB = new db();

app.set('views', './views');

/*
const bcrypt = require("bcrypt");
const handlebars = require("express-handlebars");


// * ---------------------FRONTEND-------------------------------------

app.get("/agregarProductos", (req, res) => {
    res.render("indexHbs", { layout: "agregarProductos" }); //*EN HANDLEBARS

});
app.get("/admin", async (req, res) => {
    const productos = await DB.getAll();
    res.render("indexHbs", { layout: "productos", productos });//*EN HANDLEBARS
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
*/
//*-------------------------REQUEST---------------------------------------

const esAdmin = true;

const protegida = (req, res, next) => { //MIDDLEWARE QUE REVISA SI EL USUARIO ES ADMIN O NO
    if(esAdmin){
        next()
    }
    else{
        console.log("No es admin")
    }
}

router.get('/', async (req, res) =>{
    const data = await DB.getAll('productos.txt');
    return res.send(data);
})

//*DISPONIBLE PARA USUARIOS Y ADMINISTRADORES
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
router.post('/', protegida, async (req, res) => {
    const { producto } = req.body;
    try{
        const id = await DB.save(producto, 'productos.txt');

        return res.send({agregado: producto, id: id});
    }
    catch(e){
        return res.status(404).send({ error: true, msg: e.message })
    }
})

router.put('/:id', protegida, async (req, res) => {
    const {id} = req.params;
    const {producto} = req.body;
    const productos = await DB.getAll('productos.txt');
    const pos = productos.indexOf(await DB.getById(id, 'productos.txt'))
    const anterior = productos[pos];
    productos[pos] = producto;
    res.send({actualizado: producto, anterior: anterior})
    
})

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