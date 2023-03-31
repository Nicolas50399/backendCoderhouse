const express = require('express');
const passport = require("passport")
const PassportLocal = require("passport-local").Strategy
const cookieParser = require('cookie-parser')
const session = require('express-session')
const bcrypt = require("bcrypt")
const { DBConnect, Users } = require('../DB/controllers/usuarioController')

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
        
        
        
        
        Users.findOne({ email }, (err, user) => {

            if (err){
                console.log('Error en sign up: ' + err)
                 return done(err);
            }

            //*Si el usuario ya existe
            if (user){
                console.log('Usuario ya existe')
                 return done(null, false);
            }  

            Users.create(
                newUser,
                (err, userConId) => {
                    if (err) {
                        console.log('Error al guardar usuario: ' + err)
                        return done(err);
                    }
                    console.log('Usuario guardado!')
                    return done(null, userConId);
                }
            );
        });
    })
);

passport.use(
    "login",
    new PassportLocal((username, password, done) => {
        console.log(username)
        console.log(password)
        Users.findOne({ "nombre": username }, (err, user) => {
            if (err) {
                console.log("ERROR DE LOGUEO")
                return done(err);
            }
            console.log(user)
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
        
    })
);

passport.serializeUser((userObj, done) => {
    done(null, userObj._id);
});

passport.deserializeUser((id, done) => {
    Users.findById(id, done);
    //done(null, {id: 1, name: "nico"})
});

router.get('/login', (req, res) => {
    res.render('home', { layout: "login" });
})

router.get('/register', (req, res) => {
    res.render('home', { layout: "register" });
})

router.get('/loginerror', (req, res) => {
    res.render('home', { layout: "error", mensaje: "ERROR AL LOGUEAR EL USUARIO" });
})

router.get('/registererror', (req, res) => {
    res.render('home', { layout: "error", mensaje: "ERROR AL REGISTRAR EL USUARIO" });
})

router.get('/loginfail', (req, res) => {
    res.render('home', { layout: "error", mensaje: "EL USUARIO NO EXISTE EN EL SISTEMA" });
})

router.get('/registerfail', (req, res) => {
    res.render('home', { layout: "error", mensaje: "EMAIL YA REGISTRADO EN EL SISTEMA" });
})




//*ENCRIPTACION CONTRASEÑA

const hasPassword = (pass) => {
    // ocultar
    return bcrypt.hashSync(pass, bcrypt.genSaltSync(10), null);
};
const validatePass = (pass, hashedPass) => {
    // validar
    return bcrypt.compareSync(pass, hashedPass);
};

//LOGIN
router.post('/login',
    passport.authenticate("login", { failureRedirect: "/loginerror" }),
    (req, res) => {
        const {username} = req.body
        Users.findOne({"nombre": username}, (err, user) => {
            req.session.usuario = user.nombre
            req.session.rank = user.rank
            req.session.mail = user.email
            req.session.direccion = user.direccion
            req.session.telefono = user.telefono
            req.session.foto = user.foto

            res.redirect('/main')
        })
        
    }
)

//REGISTRO

router.post('/register',
    passport.authenticate("signup", { failureRedirect: "/registererror" }),
    (req, res) => {
        const { username, email, direccion, telefono, foto } = req.body
        req.session.usuario = username
        req.session.mail = email
        req.session.direccion = direccion
        req.session.telefono = telefono
        req.session.foto = foto
        req.session.rank = 1
        res.redirect('/main')
    }
)

//DESLOGUEO
router.post('/logout', (req, res) => {
    //res.redirect('/logout')
    req.session.destroy()
    setTimeout(() => {
        res.redirect('/login')
    }, 2000)
})

module.exports = router