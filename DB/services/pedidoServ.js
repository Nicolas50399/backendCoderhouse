const mongoose = require("mongoose")
const logger = require("../../logger.js")
const { Mail } = require("../../messages/email.js")
const { SMS } = require("../../messages/sms.js")
const { WSP } = require("../../messages/whatsapp.js")
const dotenv = require('dotenv').config()

const configPedidos  = require("../configs/configPedidos.js")
const { getAll, add, removeOne, getOne } = require("../database/mongodb.js")
const { Cart } = require("./carritoServ.js")
const { Products } = require("./productoServ.js")
//const Orders = mongoose.model(configPedidos.mongoDB.collection, configPedidos.mongoDB.model)
const DAOPedidoMongo = require("../daos/pedido/DAOPedidoMongo.js");
const PedidoDto = require("../dtos/DTOPedido.js")

const Orders = new DAOPedidoMongo();

async function getOrders(res){
    await Orders.findAll((err, orders) => {
        if(err) logger.error("Error al cargar los pedidos: " + err)
        res.render('home', { layout: "pedidos", pedidos: orders })
    });
}

async function addOrder(order){
    await Orders.save(order, async (err) => {
        const user = {
            name: order.nombreUsuario,
            email: order.email,
            telefono: order.telefono
        }
        const pedido = new PedidoDto(user, order.productos)
        if(err){
            logger.error("error al guardar pedido: " + err)
        }
        logger.info("pedido guardado!")
        //*AVISAR MAIL/WSP ADMIN
        await Mail(process.env.GMAILADMIN, 'Pedido de compra', order.nombreUsuario, order.email, order.telefono, order.productos)
        await WSP(process.env.WSPADMIN, 'Pedido de compra', order.nombreUsuario, order.email, order.telefono, order.productos)
        //*SMS AL USUARIO
        await SMS(order.telefono, 'Pedido realizado')

        await Cart.deleteAll()
    });
}

async function deleteOrder(id){
    await Orders.deleteByFilters({_id: id}, (err) => {
        if(err) logger.error('Error al borrar el pedido: ' + err)
        logger.info('Pedido borrado exitosamente!')
    });
}

async function acceptOrder(id){
    await Orders.findByFilters({_id: id}, async (err, order) => {
        if(err){
            logger.error("error al encontrar el pedido: " + err)
        }
        if(!order){
            logger.error("El pedido no se encuentra en el sistema ")
        }
        //*Quito los productos que tenga ese pedido del sistema
        const productos = order.productos
        for(let i = 0; i < productos.length; i++){
            await Products.deleteByFilters({"nombre": productos[i].nombre, "marca": productos[i].marca, "precio": productos[i].precio}, (err) => {
                if(err) logger.error('Error al borrar el producto: ' + productos[i] + ' problema: ' + err)
                logger.info('Producto borrado!')
            });
        }

        await deleteOrder(id)
    });
}

module.exports = { addOrder, Orders, deleteOrder, acceptOrder, getOrders }