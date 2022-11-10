const express = require('express');
const app = express();
const db = require("./main.js")

const { Router } = express;

const router = Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

const DB = new db();

//Crea un carrito y devuelve su id
app.post('/', async (req, res) => {
    const { carrito } = req.body;
    try{
        const id = await DB.save(carrito, 'carritos.txt');
        return res.send({agregado: carrito, id: id});
    }
    catch(e){
        return res.status(404).send({ error: true, msg: e.message })
    }
})

//Vacia un carrito y lo elimina
app.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try{
        const carritoEliminado = await DB.getById(id, 'carritos.txt');
        carritoEliminado.products = []; //Vacio el carrito a eliminar
        await DB.deleteById(id, 'carritos.txt');
        return res.send({eliminado: carritoEliminado});
    }
    catch(e){
        return res.status(404).send({ error: true, msg: e.message })
    }
})

//Listar todos los productos guardados en el carrito
app.get('/:id/productos', async (req, res) => {
    const { id } = req.params;
    try{
        const carrito = await DB.getById(id, 'carritos.txt');
        return res.send(carrito.products);
    }
    catch(e){
        return res.status(404).send({ error: true, msg: e.message })
    }
})

//Incorporar productos en el carrito por su id de producto
app.post('/:id/productos', async (req, res) => {
    const { id } = req.params;
    const { productos } = req.body;
    try{
        //!Buscar producto en el archivo de productos
        //!productos = await DB.getById(producto.id, 'productos.txt');

        //Buscar carrito por su id
        const carrito = await DB.getById(id, 'carritos.txt');

        carrito.products.push(productos);

        return res.send({
            agregados: productos,
            idCarrito: id
        })
    }
    catch(e){
        return res.status(404).send({ error: true, msg: e.message })
    }
})

//Elimina un producto del carrito por su id de carrito y de producto
app.delete('/:id/productos/:id_prod', async (req, res) => {
    const { id } = req.params;
    const { id_prod } = req.params;
    try{
        const carrito = await DB.getById(id, 'carritos.txt');
        const productos = carrito.products
        carrito.products = productos.filter(p => p.id != id_prod);
        return res.send({
            carrito: carrito,
            eliminado: await DB.getById(id_prod, 'productos.txt')
        })
    }
    catch(e){
        return res.status(404).send({ error: true, msg: e.message })
    }
})