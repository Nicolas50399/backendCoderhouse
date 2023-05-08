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

async function oneProduct(req, res){
    const { id } = req.params
    await Products.findByFilters({_id: id}, async (err, product) => {
        if(err){
            logger.error("error al encontrar el pedido: " + err)
        }
        if(!product){
            logger.error("El pedido no se encuentra en el sistema ")
        }
        res.render('home', { 
            layout: "producto", 
            nombre: product.nombre, 
            descripcion: product.descripcion, 
            foto: product.foto,
            marca: product.marca,
            categoria: product.categoria,
            precio: product.precio
         })
    })
}



async function deleteProduct(req, res){
    const { id } = req.params
    await Products.deleteByFilters({_id: id}, (err) => {
        if(err) logger.error('Error al borrar el producto: ' + err)
        logger.info('Producto borrado exitosamente!')
        res.redirect('/main')
    })
}

async function updateProduct(req, res, imageName){
    
    const { id } = req.params

    const { nombreM, marcaM, descripcionM, categoriaM, precioM } = req.body
    await Products.updateByFilters({_id: id}, {
        nombre: nombreM,
        marca: marcaM,
        descripcion: descripcionM,
        categoria: categoriaM,
        precio: precioM,
        foto: imageName
    })
    res.redirect('/main')
}


module.exports = { Products, newProducto, allProducts, oneProduct, deleteProduct, updateProduct }