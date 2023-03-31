const express = require('express');

const { Router } = express;

const cart = require('../containers/ContenedorMemoria')
const Cart = new cart()
const { Products } = require('../DB/controllers/productoController');
const { auth, adminAuth, authMW } = require('./auths')
const logger = require('../logger');

const router = Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/cart', auth, adminAuth,  (req, res) => {
    res.render('home', { layout: "carrito", productos: Cart.findAll(), name: req.session.usuario });
})

router.post('/agregar/:id', (req, res) => {
    const { id } = req.params

    Products.findOne({_id: id}, async (err, product) => {
        if(err){
            logger.error("error al encontrar el producto: " + err)
        }
        console.log(product.nombre)
        const buscado = await Cart.findById(product._id)
        console.log(buscado)
        if(buscado){
            logger.error("ERROR. El producto ya esta en el carrito")
        }
        else{
            const newProductCart = {
                id: product._id,
                nombre: product.nombre,
                marca: product.marca,
                precio: product.precio,
                foto: product.foto
            }
            await Cart.save(newProductCart)
            logger.info("Producto agregado!")
        }
    })
    
    res.redirect('/main')
})

router.post('/quitar/:id', (req, res) => {
    const { id } = req.params

    Cart.delete(id)
    
    res.redirect('/cart')
})

router.post('/vaciar', (req, res) => {

    Cart.deleteAll()
    
    res.redirect('/cart')
})

router.post('/confirmar', (req, res) => {

    Cart.deleteAll()
    //*AVISAR MAIL/WSP ADMIN
    res.redirect('/main')
})

module.exports = router