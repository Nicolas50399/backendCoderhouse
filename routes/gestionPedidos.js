const express = require('express');
const { Orders } = require('../DB/controllers/pedidoController');
const { Products } = require('../DB/controllers/productoController');
const logger = require('../logger');
const { auth, adminAuth } = require('./auths');

const { Router } = express;

const router = Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());


router.get('/pedidos', auth, adminAuth, (req, res) => {
    try {
        Orders.find({}, (err, orders) => {
            if(err) logger.error("Error al cargar los pedidos: " + err)
            res.render('home', { layout: "pedidos", pedidos: orders })
        }).lean()
        
    } catch (e) {
        logger.error(`Error en api de pedidos: ${e}`)
    }
})

router.post('/aceptar/:id', (req, res) => {
    const { id } = req.params

    Orders.findOne({_id: id}, async (err, order) => {
        if(err){
            logger.error("error al encontrar el pedido: " + err)
        }
        if(!order){
            logger.error("El pedido no se encuentra en el sistema ")
        }
        //*Quito los productos que tenga ese pedido del sistema
        const productos = order.productos
        for(let i = 0; i < productos.length; i++){
            Products.deleteOne({"nombre": productos[i].nombre, "marca": productos[i].marca, "precio": productos[i].precio}, (err) => {
                if(err) logger.error('Error al borrar el producto: ' + productos[i] + ' problema: ' + err)
                logger.info('Producto borrado!')
                console.log(productos[i])
            })
        }
        
        //*Elimino el pedido ya que fue atendido
        Orders.deleteOne({_id: id}, (err) => {
            if(err) logger.error('Error al borrar el pedido: ' + err)
            logger.info('Pedido borrado exitosamente!')
        })
        
    })
    res.redirect('/pedidos')
})

router.post('/rechazar/:id', (req, res) => {
    const { id } = req.params

    Orders.deleteOne({_id: id}, (err) => {
        if(err) logger.error('Error al borrar el pedido: ' + err)
        logger.info('Pedido borrado exitosamente!')
    })

    res.redirect('/pedidos')
})





module.exports = router