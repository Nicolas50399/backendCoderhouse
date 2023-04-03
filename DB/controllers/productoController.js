
const logger = require("../../logger.js")


const { newProducto, Products, findProductos, allProducts } = require("../services/productoServ.js")

async function getProductos(req, res){
    try {
        await allProducts(req, res)
    } catch (e) {
        logger.error(`Error en api de productos: ${e}`)
    }
}

async function addProducto(req, res){
    try{
        const { nombre, marca, precio, foto } = req.body
        const newProduct = {
            nombre: nombre,
            marca: marca,
            precio: precio,
            foto: foto
        }
        await newProducto(newProduct)
        return res.redirect('/agregarProductos')
    }
    catch(e){
        logger.error(`Error en api de productos: ${e}`)
    }
}

function getAgregarProducto(req, res){
    res.render('home', { layout: "agregarProductos", name: req.session.usuario });
}

module.exports = { getProductos, addProducto, getAgregarProducto }