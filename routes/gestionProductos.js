const express = require('express');

const { Router } = express;

const { addProducto, getAgregarProducto } = require('../DB/controllers/productoController');
const { auth, adminAuth, authMW } = require('./auths')

const router = Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
/*
router.get('/producto/:id', auth, async (req, res) => {
    const { id } = req.params
    try {
        const data = await DB.getById(id, 'productos.txt')
        console.log(data)
        if (data == -1) {
            return res.status(404).render('home', { layout: "error" })
        }
        else {
            return res.render('home', { layout: "producto", ...data })
        }
    } catch (e) {
        logger.error(`Error en api de productos: ${e}`)
        return res.status(404).render('home', { layout: "error" })
    }
})
*/

router.get('/agregarProductos', auth, adminAuth, getAgregarProducto);
router.post('/api/productos', addProducto)

module.exports = router