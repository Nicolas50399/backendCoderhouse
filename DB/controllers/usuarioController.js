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



function getProfile(req, res){
    try {
        res.render('home', { 
            layout: "miPerfil", 
            name: req.session.usuario, 
            mail: req.session.mail,
            adress: req.session.direccion,
            phone: req.session.telefono,
            foto: req.session.foto
         })
    } catch (e) {
        logger.error(`Error en api de usuarios: ${e}`)
    }
}
let userImage
function setUserImage(img){
    userImage = img
}

async function addUser(req, res){
    const { username, email, direccion, telefono, foto, pais } = req.body
    req.session.usuario = username
    req.session.mail = email
    req.session.direccion = direccion
    req.session.telefono = telefono
    req.session.rank = 1
    req.session.foto = userImage
    req.session.pais = pais
    await Mail(process.env.GMAILADMIN, 'Registro', username, email, telefono, [], 0)
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

module.exports = { DBConnect, addUser, loginUser, logoutUser, getLogin, getRegister, getLoginError, getRegisterError, getLoginFail, getRegisterFail, getProfile, setUserImage }