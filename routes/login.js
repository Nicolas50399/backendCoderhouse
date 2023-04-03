const express = require('express');
const passport = require("passport")
const bcrypt = require("bcrypt")
const PassportLocal = require("passport-local").Strategy
const cookieParser = require('cookie-parser')
const session = require('express-session')
const { addUser, loginUser, logoutUser, getLogin, getRegister, getLoginError, getRegisterError, getLoginFail, getRegisterFail } = require('../DB/controllers/usuarioController');
const { Users, passportLogin, passportRegister } = require('../DB/services/usuarioServ');

const { Router } = express;

const router = Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.use(cookieParser('keyboard cat'))

router.use(session({
    secret: 'keyboard cat',
    cookie: {
        httpOnly: false,
        secure: false,
        maxAge: 60000
    },
    resave: true,
    saveUninitialized: true
}))

router.use(passport.initialize());
router.use(passport.session());



passport.use(
    "signup",
    new PassportLocal({ passReqToCallback: true }, (req, username, password, done) => {
        
        const {email, direccion, telefono, foto} = req.body
        
        
        
        const newUser = {
            nombre: username,
            email: email,
            clave: hasPassword(password),
            direccion: direccion,
            telefono: telefono,
            foto: foto,
            rank: 1
        }
        
        passportRegister(newUser, done)
        
        
        
    })
);

passport.use(
    "login",
    new PassportLocal((username, password, done) => {
        passportLogin(username, password, done)
    })
);

passport.serializeUser((userObj, done) => {
    done(null, userObj._id);
});

passport.deserializeUser((id, done) => {
    Users.findById(id, done);
    //done(null, {id: 1, name: "nico"})
});

router.get('/login', getLogin)

router.get('/register', getRegister)

router.get('/loginerror', getLoginError)

router.get('/registererror', getRegisterError)

router.get('/loginfail', getLoginFail)

router.get('/registerfail', getRegisterFail)




//*ENCRIPTACION CONTRASEÑA

const hasPassword = (pass) => {
    // ocultar
    return bcrypt.hashSync(pass, bcrypt.genSaltSync(10), null);
};


//LOGIN
router.post('/login',
    passport.authenticate("login", { failureRedirect: "/loginerror" }),
    loginUser
)

//REGISTRO

router.post('/register',
    passport.authenticate("signup", { failureRedirect: "/registererror" }),
    addUser
)

//DESLOGUEO
router.post('/logout', logoutUser)

module.exports = router