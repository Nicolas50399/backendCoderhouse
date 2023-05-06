import mongoose from "mongoose";

const pedidosCollection = 'orders';

const PedidoSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nombreUsuario: {type: String, require: true, max: 100},
    email: {type: String, require: true, max: 100},
    telefono: {type: String, require: true, max: 100},
    productos: [{
        nombre: {type: String, require: true, max: 100},
        marca: {type: String, require: true, max: 100},
        precio: {type: Number, require: true, max: 100},
        _id: mongoose.Schema.Types.ObjectId
    }]
})

module.exports = mongoose.model(pedidosCollection, PedidoSchema)