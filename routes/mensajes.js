const express = require('express');
const path = require('path');
const { auth } = require('./auths');
const { Router } = express;

const router = Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/mensajes', auth, (req, res) => {
    res.render('home', {
        layout: "mensajes"
    })
})

module.exports = router