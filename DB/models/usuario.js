import mongoose from "mongoose";

const usuariosCollection = 'usuarios';

const UsuarioSchema = new mongoose.Schema({
    nombre: {type: String, require: true, max: 100},
    email: {type: String, require: true, max: 100},
    password: {type: Number, require: true, max: 100}
})

export const usuarios = mongoose.model(usuariosCollection, UsuarioSchema)