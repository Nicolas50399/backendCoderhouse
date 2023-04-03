const mongoose = require("mongoose")
const logger = require("../../logger.js")
const configProductos  = require("../configs/configProductos.js")
const { getAll, add } = require("../database/mongodb.js")
const Products = mongoose.model(configProductos.mongoDB.collection, configProductos.mongoDB.model)

async function allProducts(req, res){
    await getAll(Products, (err, products) => {
        if(err) logger.error("Error al cargar los productos: " + err)
        res.render('home', { layout: "productos", productos: products, name: req.session.usuario, mail: req.session.mail })
    })
}

async function newProducto(producto){
    await add(Products, producto, (err) => {
        if(err){
            logger.error("error al guardar producto: " + err)
        }
        logger.info("producto guardado!")
    })
}


module.exports = { Products, newProducto, allProducts }