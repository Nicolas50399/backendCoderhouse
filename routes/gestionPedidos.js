const express = require('express');
const { getPedidos, acceptPedido, declinePedido } = require('../DB/controllers/pedidoController');
const { auth, adminAuth } = require('./auths');

const { Router } = express;

const router = Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());


router.get('/pedidos', auth, adminAuth, getPedidos)

router.post('/aceptar/:id', acceptPedido)

router.post('/rechazar/:id', declinePedido)





module.exports = router