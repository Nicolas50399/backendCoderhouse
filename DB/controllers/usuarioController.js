const mongoose = require("mongoose");
const { Mail } = require("../../messages/email.js");
const dotenv = require('dotenv').config()

const configUsuarios  = require("../configs/configUsuarios.js");
const { initializeUser } = require("../services/usuarioServ.js");

function DBConnect(cb){
    mongoose.connect(configUsuarios.mongoDB.uri, configUsuarios.mongoDB.options, (err) => {
        if(err) console.log(err);
        cb()
    })
}


async function addUser(req, res){
    const { username, email, direccion, telefono, foto, pais } = req.body

    req.session.usuario = username
    req.session.mail = email
    req.session.direccion = direccion
    req.session.telefono = telefono
    req.session.foto = foto
    req.session.rank = 1
    req.session.pais = pais
    await Mail(process.env.GMAILADMIN, 'Registro', username, email, telefono, [])
    res.redirect('/main')
}

async function loginUser(req, res){
    const {username} = req.body
    await initializeUser(req, res, username)
}

function logoutUser(req, res){
    req.session.destroy()
    setTimeout(() => {
        res.redirect('/login')
    }, 2000)
}

function getLogin(req, res){
    res.render('home', { layout: "login" });
}
function getRegister(req, res){
    res.render('home', { layout: "register" });
}
function getLoginError(req, res){
    res.render('home', { layout: "error", mensaje: "ERROR AL LOGUEAR EL USUARIO" });
}
function getRegisterError(req, res){
    res.render('home', { layout: "error", mensaje: "ERROR AL REGISTRAR EL USUARIO" });
}
function getLoginFail(req, res){
    res.render('home', { layout: "error", mensaje: "EL USUARIO NO EXISTE EN EL SISTEMA" });
}
function getRegisterFail(req, res){
    res.render('home', { layout: "error", mensaje: "EMAIL YA REGISTRADO EN EL SISTEMA" });
}

module.exports = { DBConnect, addUser, loginUser, logoutUser, getLogin, getRegister, getLoginError, getRegisterError, getLoginFail, getRegisterFail }