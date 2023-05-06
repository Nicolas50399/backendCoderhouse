//const mongoose = require("mongoose")
const logger = require("../../logger.js")
const configProductos  = require("../configs/configProductos.js")
const { getAll, add } = require("../database/mongodb.js")

const DAOProductoMongo = require("../daos/producto/DAOProductoMongo.js");
const MyProductFactory = require("../factory/MyProductFactory.js");
const RepoProductos = require("../repository/repoProductos.js");

//const RepoProducts = new RepoProductos()
const Products = new DAOProductoMongo()

async function allProducts(req, res){
    /*await RepoProducts.getAll((err, products) => {
        if(err) logger.error("Error al cargar los productos: " + err)
        res.render('home', { layout: "productos", productos: products, name: req.session.usuario, mail: req.session.mail })
    })*/
    await Products.findAll((err, products) => {
        if(err) logger.error("Error al cargar los productos: " + err)
        res.render('home', { layout: "productos", productos: products, name: req.session.usuario, mail: req.session.mail })
    })
}

async function newProducto(producto){
    const factory = new MyProductFactory(producto)
    await Products.save(producto, (err) => {
        if(err){
            logger.error("error al guardar producto: " + err)
        }
        logger.info("producto guardado!")
    })
}


module.exports = { Products, newProducto, allProducts }