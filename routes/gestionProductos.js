const express = require('express');

const { Router } = express;

const router = Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/producto/:id', async (req, res) => {
    const { id } = req.params
    try {
        const data = await DB.getById(id, 'productos.txt')
        console.log(data)
        if (data == -1) {
            return res.status(404).render('home', { layout: "error" })
        }
        else {
            return res.render('home', { layout: "producto", ...data })
        }
    } catch (e) {
        logger.error(`Error en api de productos: ${e}`)
        return res.status(404).render('home', { layout: "error" })
    }
})

router.get('/agregarProductos', (req, res) => {
    res.render('home', { layout: "agregarProductos" });
});

//AGREGAR PRODUCTO
router.post('/api/productos', async (req, res) => {
    try{
        const { nombre, marca, precio } = req.body
        console.log(req.body)
        const id = await DB.save({ nombre, marca, precio }, 'productos.txt')
        console.log(id)
        //res.send({error: false, msg: 'Producto agregado con id' + id})
        return res.redirect('/agregarProductos')
    }
    catch(e){
        logger.error(`Error en api de productos: ${e}`)
    }
    
})

module.exports = router