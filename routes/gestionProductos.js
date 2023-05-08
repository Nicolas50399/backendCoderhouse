const express = require('express');

const { Router } = express;

const { addProducto, getAgregarProducto, getProducto, removeProducto, setProducto, upload } = require('../DB/controllers/productoController');
const { auth, adminAuth, authMW } = require('./auths');
const bodyParser = require('body-parser');


const router = Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(bodyParser.urlencoded({extended: true}))

router.get('/producto/:id', auth, getProducto)
router.get('/agregarProductos', auth, adminAuth, getAgregarProducto);
router.post('/api/productos', upload, addProducto)
router.post('/eliminar/:id', auth, adminAuth, removeProducto)
router.post('/modificar/:id', auth, adminAuth, setProducto)

module.exports = router