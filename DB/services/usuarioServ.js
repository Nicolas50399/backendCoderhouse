const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const configUsuarios  = require("../configs/configUsuarios.js");
//const Users = mongoose.model(configUsuarios.mongoDB.collection, configUsuarios.mongoDB.model)
const { getOne, add } = require('../database/mongodb')
const DAOUsuarioMongo = require("../daos/usuario/DAOUsuarioMongo.js");

const Users = new DAOUsuarioMongo()

async function initializeUser(req, res, username){
    await Users.findByFilters({"nombre": username}, (err, user) => {
        req.session.usuario = user.nombre
        req.session.rank = user.rank
        req.session.mail = user.email
        req.session.direccion = user.direccion
        req.session.telefono = user.telefono
        req.session.foto = user.foto
        req.session.pais = user.pais
        res.redirect('/main')
    })
}

async function passportLogin(username, password, done){
    await Users.findByFilters({ "nombre": username }, (err, user) => {
        if (err) {
            console.log("ERROR DE LOGUEO")
            return done(err);
        }
        //* si el usuario no existe
        if (!user){
            console.log("ERROR, Usuario no existe")
            return done(null, false);
        }
        //*si la contraseña es invalida
        if (!validatePass(password, user.clave)) {
            console.log("USUARIO LOGUEADO")
            return done(null, false);
        }
        return done(null, user);
    });
}

async function passportRegister(newUser, done){
    await Users.findByFilters({ "email": newUser.email }, async (err, user) => {

        if (err){
            console.log('Error en sign up: ' + err)
             return done(err);
        }

        //*Si el usuario ya existe
        if (user){
            console.log('Usuario ya existe')
             return done(null, false);
        } 
        await Users.save(newUser,
            (err, userConId) => {
                if (err) {
                    console.log('Error al guardar usuario: ' + err)
                    return done(err);
                }
                console.log('Usuario guardado!')
                return done(null, userConId);
            });
    });
}

const validatePass = (pass, hashedPass) => {
    // validar
    return bcrypt.compareSync(pass, hashedPass);
};

module.exports = { initializeUser, Users, passportLogin, passportRegister }