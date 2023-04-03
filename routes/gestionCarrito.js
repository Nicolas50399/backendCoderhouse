const express = require('express');

const { Router } = express;

const { auth, adminAuth, authMW } = require('./auths')
const { addProductoCarrito, getCart, clearCarrito, removeProductoCarrito, confirmPedido } = require('../DB/controllers/carritoController');


const router = Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/cart', auth,  getCart)

router.post('/agregar/:id', addProductoCarrito)

router.post('/quitar/:id', removeProductoCarrito)

router.post('/vaciar', clearCarrito)

router.post('/confirmar', confirmPedido)

module.exports = router