const express = require('express');

const { Router } = express;

const { addProducto, getAgregarProducto, getProducto, removeProducto, setProducto } = require('../DB/controllers/productoController');
const { auth, adminAuth, authMW } = require('./auths')

const router = Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/producto/:id', auth, getProducto)
router.get('/agregarProductos', auth, adminAuth, getAgregarProducto);
router.post('/api/productos', addProducto)
router.post('/eliminar/:id', auth, adminAuth, removeProducto)
router.post('/modificar/:id', auth, adminAuth, setProducto)

module.exports = router