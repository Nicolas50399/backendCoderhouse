import mongoose from "mongoose";

const usuariosCollection = 'users';

const UsuarioSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nombre: {type: String, require: true, max: 100},
    email: {type: String, require: true, max: 100},
    clave: {type: String, require: true, max: 100},
    direccion: {type: String, require: true, max: 100},
    telefono: {type: String, require: true, max: 100},
    foto: {type: String, require: false, max: 100},
    rank: {type: Number, require: true, max: 1}
})

module.exports = mongoose.model(usuariosCollection, UsuarioSchema)