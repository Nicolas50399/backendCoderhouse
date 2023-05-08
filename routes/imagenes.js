const express = require('express');
const path = require('path')
const { Router } = express;

const router = Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());



router.get('/images/:img', (req, res) => {
    const { img } = req.params
    //res.sendFile(path.resolve(`/uploads/${img}`));
    res.sendFile( `${img}`, { root: "uploads"} );
});

module.exports = router