const { addProductCart, removeProductCart, getAllCart, clearAllCart } = require("../services/carritoServ");
const { addOrder } = require("../services/pedidoServ");

async function getCart(req, res){
    res.render('home', { layout: "carrito", productos: await getAllCart(), name: req.session.usuario });
}

async function addProductoCarrito(req, res){
    const { id } = req.params

    await addProductCart(id)
    
    res.redirect('/main')
}

async function removeProductoCarrito(req, res){
    const { id } = req.params

    await removeProductCart(id)
    
    res.redirect('/cart')
}

async function clearCarrito(req, res){
    await clearAllCart()
    
    res.redirect('/cart')
}

async function confirmPedido(req, res){
    const newOrder = {

        nombreUsuario: req.session.usuario,
        email: req.session.mail,
        telefono: req.session.telefono,
        productos: await getAllCart()
    }
    await addOrder(newOrder)

    res.redirect('/main')
}

module.exports = { addProductoCarrito, getCart, removeProductoCarrito, clearCarrito, confirmPedido }