const logger = require("../../logger")
const { Products } = require("./productoServ")
const cart = require('../../containers/ContenedorMemoria');
const { getOne } = require("../database/mongodb");
const Cart = new cart()

async function getAllCart(){
    return await Cart.findAll()
}

async function addProductCart(id){
    await getOne(Products, {_id: id}, async (err, product) => {
        if(err){
            logger.error("error al encontrar el producto: " + err)
        }

        const buscado = await Cart.findById(product._id)

        if(buscado){
            logger.error("ERROR. El producto ya esta en el carrito")
        }
        else{
            const newProductCart = {
                id: product._id,
                nombre: product.nombre,
                marca: product.marca,
                precio: product.precio,
                foto: product.foto
            }
            await Cart.save(newProductCart)
            logger.info("Producto agregado!")
        }
    })
    
}

async function removeProductCart(id){
    await Cart.delete(id)
}

async function clearAllCart(){
    await Cart.deleteAll()
}

module.exports = { getAllCart, addProductCart, removeProductCart, clearAllCart, Cart }