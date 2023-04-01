const express = require('express');

const { Router } = express;

const { Products } = require('../DB/controllers/productoController');
const { auth, adminAuth, authMW } = require('./auths')
const logger = require('../logger');

const router = Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/producto/:id', auth, async (req, res) => {
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

router.get('/agregarProductos', auth, adminAuth,  (req, res) => {
    res.render('home', { layout: "agregarProductos", name: req.session.usuario });
});

//AGREGAR PRODUCTO
router.post('/api/productos', (req, res) => {
    try{
        const { nombre, marca, precio, foto } = req.body
        const newProduct = {
            nombre: nombre,
            marca: marca,
            precio: precio,
            foto: foto
        }
        Products.create(newProduct, (err) => {
            if(err){
                logger.error("error al guardar producto: " + err)
            }
            logger.info("producto guardado!")
        })
        return res.redirect('/agregarProductos')
    }
    catch(e){
        logger.error(`Error en api de productos: ${e}`)
    }
    
})

module.exports = router