const logger = require("../../logger.js")
const { Orders, deleteOrder, acceptOrder, getOrders } = require("../services/pedidoServ.js")

async function getPedidos(req, res){
    try {
        await getOrders(res)
        
    } catch (e) {
        logger.error(`Error en api de pedidos: ${e}`)
    }
}

async function acceptPedido(req, res){
    const { id } = req.params
    await acceptOrder(id)
    res.redirect('/pedidos')
}

async function declinePedido(req, res){
    const { id } = req.params

    await deleteOrder(id)

    res.redirect('/pedidos')
}

module.exports = { Orders, getPedidos, acceptPedido, declinePedido }