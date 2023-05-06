import mongoose from "mongoose";

const productosCollection = 'products';

const ProductoSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nombre: {type: String, require: true, max: 100},
    marca: {type: String, require: true, max: 100},
    precio: {type: Number, require: true, max: 100},
    foto: {type: String, require: false, max: 100}
})

module.exports = mongoose.model(productosCollection, ProductoSchema)