const express = require('express');
const path = require('path')
const { Router } = express;

const router = Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());



router.get('/images/products/:img', (req, res) => {
    const { img } = req.params
    res.sendFile( `${img}`, { root: "uploads/products"} );
});

router.get('/images/users/:img', (req, res) => {
    const { img } = req.params
    res.sendFile( `${img}`, { root: "uploads/users"} );
});

module.exports = router