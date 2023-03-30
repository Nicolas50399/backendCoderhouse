const express = require('express');

const { Router } = express;

const { Products } = require('../DB/controllers/productoController');
const logger = require('../logger');

const router = Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.post('/agregar/:id', (req, res) => {
    const { id } = req.params
    logger.info("id: "+id)


    
    res.redirect('/main')
})

module.exports = router