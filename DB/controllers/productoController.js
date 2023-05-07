
const logger = require("../../logger.js")


const { newProducto, Products, findProductos, allProducts, oneProduct, deleteProduct, updateProduct } = require("../services/productoServ.js")

async function getProductos(req, res){
    try {
        await allProducts(req, res)
    } catch (e) {
        logger.error(`Error en api de productos: ${e}`)
    }
}

async function getProducto(req, res){
    try {
        await oneProduct(req, res)
    } catch(e){
        logger.error(`Error en api de productos: ${e}`)
    }
}

async function addProducto(req, res){
    try{
        const { nombre, marca, descripcion, categoria, precio, foto } = req.body
        const newProduct = {
            nombre: nombre,
            descripcion: descripcion,
            marca: marca,
            categoria: categoria,
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

async function removeProducto(req, res){
    try{
        await deleteProduct(req, res)
    } catch(e){
        logger.error(`Error en api de productos: ${e}`)
    }
}

async function setProducto(req, res){
    try{
        await updateProduct(req, res)
    } catch(e){
        logger.error(`Error en api de productos: ${e}`)
    }
}

module.exports = { getProductos, addProducto, getAgregarProducto, getProducto, removeProducto, setProducto }