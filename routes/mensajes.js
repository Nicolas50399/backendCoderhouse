const express = require('express');

const { auth } = require('./auths');
const { allMessages, mensajesPropios } = require('../DB/services/mensajeServ');
const { Router } = express;



const router = Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());



router.get('/mensajes', auth, async (req, res) => {

    await allMessages(req, res)
})

router.get('/mensajes/:email', auth, async (req, res) => {

    await mensajesPropios(req, res)
})


module.exports = router