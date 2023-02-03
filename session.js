const express = require('express');
//const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const bcrypt = require("bcrypt")
const passport = require("passport")
const { Strategy } = require("passport-local")
require('dotenv').config()
const yargs = require('yargs/yargs')(process.argv.slice(2))
const args = yargs
    .default({ puerto: 8080, modo: 'FORK' }).argv



switch (args.puerto) {
    case "FORK": {
        require('child_process').spawn('node', ['session.js'])
    }
    case "CLUSTER": {
        //uso el modulo cluster
        const http = require('http')
        const cluster = require('cluster')
        const numCPUs = require('os').cpus().length
        if (cluster.isMaster) {
            for (let i = 0; i < numCPUs; i++) {
                cluster.fork()
            }

            cluster.on('exit', (worker, code, signal) => {
                console.log(`worker id: ${worker.process.pid} muerto`)
            })
        }
        else {
            http.createServer((req, res) => {
                res.writeHead(200)
                res.end('hola mundo')
            }).listen(8083)
            console.log(`worker id: ${worker.process.pid} iniciado`)
        }
    }
    default: { }
}

const processRouter = require('./process')

const MongoStore = require('connect-mongo')
const DAOUsuarioMongo = require("./DB/daos/usuario/DAOUsuarioMongo.js")
const MongoUsers = new DAOUsuarioMongo();
const advancedOptions = { useNewUrlParser: process.env.USENEWURLPARSER, useUnifiedTopology: process.env.USEUNIFIEDTOPOLOGY }

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));

const db = require("./containers/ContenedorArchivos.js")
const DB = new db();

//app.use(cookieParser())

const handlebars = require("express-handlebars");

app.set('views', './views/');

const hbs = handlebars.engine({
    extname: 'hbs',
    layoutsDir: './views/layouts/'
})

app.engine('hbs', hbs)

app.set('view engine', 'hbs');

app.use('/', processRouter)

//middlewares

//*CREDENCIALES!!!!!
app.use(
    session({
        store: MongoStore.create({
            mongoUrl: process.env.MONGOURL,
            mongoOptions: advancedOptions,
            ttl: process.env.TTL //*10 minutos
        }),
        secret: process.env.SECRET,
        resave: process.env.RESAVE,
        saveUninitialized: process.env.SAVEUNINITIALIZED
    }))

app.use(passport.initialize());
app.use(passport.session());


//* ESTRATEGIAS PASSPORT

passport.use(
    "signup",
    new Strategy({ passReqToCallback: true }, (req, username, password, done) => {
        console.log(username, password);

        const { email } = req.body;
        MongoUsers.db.findOne({ username }, (err, user) => {
            console.log(user);
            console.log(err);

            //*Si el usuario ya existe
            if (user) return done(null, false);

            Users.create(
                { username, password: hasPassword(password), email },
                (err, user) => {
                    if (err) return done(err);

                    return done(null, user);
                }
            );
        });
    })
);

passport.use(
    "login",
    new Strategy({}, (username, password, done) => {
        MongoUsers.db.findOne({ username }, (err, user) => {
            if (err) return done(err);
            //* si el usuario no existe
            if (!user) return done(null, false);
            //*si la contraseña es invalida
            if (!validatePass(password, user.password)) return done(null, false);
            return done(null, user);
        });
    })
);

passport.serializeUser((userObj, done) => {
    done(null, userObj._id);
});

passport.deserializeUser((id, done) => {
    MongoUsers.db.findById(id, done);
});

//* AUTORIZACIONES

const auth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login')
    }
};
const adminAuth = (req, res, next) => {
    if (req.session.rank >= 1) {
        next();
    } else {
        res.status(401).send({ error: true });
    }
};

//*ENCRIPTACION CONTRASEÑA

const hasPassword = (pass) => {
    // ocultar
    return bcrypt.hashSync(pass, bcrypt.genSaltSync(10), null);
};
const validatePass = (pass, hashedPass) => {
    // validar
    return bcrypt.compareSync(pass, hashedPass);
};

//*REDIRIGIR DEPENDIENDO SI EXISTE SESION ACTIVA

app.get("/", (req, res) => {
    if (req.session.user) {
        res.redirect('/admin')
    } else {
        res.redirect('/login')
    }

});

//* RUTAS GET (PAGINAS)

app.get('/admin', auth, adminAuth, async (req, res) => {
    const data = await DB.getAll('productos.txt')
    res.render('home', { layout: "productos", productos: data, name: req.session.user, mail: req.session.mail })
})

app.get('/agregarProductos', (req, res) => {
    res.render('home', { layout: "agregarProductos" });
});

app.get('/producto/:id', async (req, res) => {
    const { id } = req.params
    try {
        const data = await DB.getById(id, 'productos.txt')
        console.log(data)
        if (data == -1) {
            return res.status(404).render('home', { layout: "error" })
        }
        else {
            return res.render('home', { layout: "producto", ...data })
        }
    } catch (e) {
        return res.status(404).render('home', { layout: "error" })
    }
})

app.get('/login', (req, res) => {
    res.render('home', { layout: "login" });
})

app.get('/register', (req, res) => {
    res.render('home', { layout: "register" });
})

app.get('/loginerror', (req, res) => {
    res.render('home', { layout: "error", mensaje: "ERROR AL LOGUEAR EL USUARIO" });
})

app.get('/registererror', (req, res) => {
    res.render('home', { layout: "error", mensaje: "ERROR AL REGISTRAR EL USUARIO" });
})

app.get('/loginfail', (req, res) => {
    res.render('home', { layout: "error", mensaje: "EL USUARIO NO EXISTE EN EL SISTEMA" });
})

app.get('/registerfail', (req, res) => {
    res.render('home', { layout: "error", mensaje: "EMAIL YA REGISTRADO EN EL SISTEMA" });
})



//* RUTAS POST (ACCIONES)

//AGREGAR PRODUCTO
app.post('/api/productos', async (req, res) => {
    const { nombre, marca, precio } = req.body
    console.log(req.body)
    const id = await DB.save({ nombre, marca, precio }, 'productos.txt')
    console.log(id)
    //res.send({error: false, msg: 'Producto agregado con id' + id})
    return res.redirect('/agregarProductos')
})

//LOGIN
app.post('/login',
    passport.authenticate("login", { failureRedirect: "/loginfail" }),
    async (req, res) => {
        const { email, clave } = req.body
        try {
            /*
            const user = await MongoUsers.findByUser(email, clave)
            console.log(user)
            if(!user){//*Si el usuario no existe en el sistema
                console.log("email ya registrado")
                return res.redirect('/loginfail')
            }*/

            //*Si el usuario existe
            req.session.usuario = user.username
            req.session.rank = user.rank
            req.session.mail = user.email
            return res.redirect('/admin')
        } catch (e) {
            res.redirect("/loginerror");
        }
    })


//REGISTRO
app.post('/register',
    passport.authenticate("signup", { failureRedirect: "/registerfail" }),
    async (req, res) => {
        const { nombre, email, clave } = req.body

        try {
            /*
            const users = await MongoUsers.findAll()
            const mail = users.find(u => u.email == email)
            
            if(mail){//*Si el email ya existe en el sistema
                console.log("email ya registrado")
                return res.redirect('/registerfail')
            }
            */
            //*Si el email es nuevo
            await MongoUsers.save({ nombre, email, clave })
            req.session.usuario = nombre
            req.session.mail = email
            req.session.rank = 1
            return res.redirect('/admin')
        }
        catch (e) {
            res.redirect("/registererror");
        }

    })

//DESLOGUEO
app.post('/logout', (req, res) => {
    //res.redirect('/logout')
    req.session.destroy()
    setTimeout(() => {
        res.redirect('/login')
    }, 2000)
})








/*app.get('/logout', (req, res) => {
    res.render('home', { layout: "despedida", name: req.session.user })
    
})*/


app.listen(args.puerto, () => console.log("conectados"));