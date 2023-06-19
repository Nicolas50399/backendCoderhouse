const express = require('express');
const passport = require("passport")
const bcrypt = require("bcrypt")
const PassportLocal = require("passport-local").Strategy
const cookieParser = require('cookie-parser')
const session = require('express-session')
const { addUser, loginUser, logoutUser, getLogin, getRegister, getLoginError, getRegisterError, getLoginFail, getRegisterFail, setUserImage } = require('../DB/controllers/usuarioController');
const { Users, passportLogin, passportRegister } = require('../DB/services/usuarioServ');

const { Router } = express;

const router = Router();

const multer = require('multer');
const path = require('path')
let imageUserName

const storage = multer.diskStorage({
    destination: path.join(__dirname, "../uploads/users"),
    filename: function (req, file, cb) {
        // generate the public name, removing problematic characters
        const originalName = encodeURIComponent(path.parse(file.originalname).name).replace(/[^a-zA-Z0-9]/g, '')
        const timestamp = Date.now()
        const extension = path.extname(file.originalname).toLowerCase()
        imageUserName = originalName + '_' + timestamp + extension
        cb(null, imageUserName)
    }
})

const uploadUser = multer({
    storage: storage,
    limits: { fileSize: 1 * 1024 * 1024 }, // 1 Mb
    fileFilter: (req, file, callback) => {
        const acceptableExtensions = ['png', 'jpg', 'jpeg', 'jpg']
        if (!(acceptableExtensions.some(extension => 
            path.extname(file.originalname).toLowerCase() === `.${extension}`)
        )) {
            return callback(new Error(`Extension no permitida, las aceptadas son ${acceptableExtensions.join(',')}`))
        }
        callback(null, true)
    }
}).single('foto')

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.use(cookieParser('keyboard cat'))

router.use(session({
    secret: 'keyboard cat',
    cookie: {
        httpOnly: false,
        secure: false,
        maxAge: 600000
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
            foto: imageUserName,
            rank: 1
        }
        
        passportRegister(newUser, done)
        setUserImage(imageUserName)
        
        
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
    Users.findById(id, done)
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
    uploadUser,
    passport.authenticate("signup", { failureRedirect: "/registererror" }),
    addUser
)

//DESLOGUEO
router.post('/logout', logoutUser)

module.exports = router