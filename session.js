const express = require('express');
//const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')

const MongoStore = require('connect-mongo')
const DAOUsuarioMongo = require("./DB/daos/usuario/DAOUsuarioMongo.js")
const MongoUsers = new DAOUsuarioMongo();
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }

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

//middlewares

app.use(
    session({
        store: MongoStore.create({
            mongoUrl: 'mongodb+srv://nico:nico123@backend.vvcutsc.mongodb.net/sesiones',
            mongoOptions: advancedOptions,
            ttl: 60
        }),
        secret: "secreto",
        resave: false,
        saveUninitialized: false
    }))

const auth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).send({ error: true });
    }
};
const adminAuth = (req, res, next) => {
    if (req.session.isAdmin) {
        next();
    } else {
        res.status(401).send({ error: true });
    }
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
    res.render('home', { layout: "productos", productos: data, name: req.session.user })
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
    res.render('home', { layout: "error", mensaje: "USER ERROR LOGIN" });
})

app.get('/registererror', (req, res) => {
    res.render('home', { layout: "error", mensaje: "USER ERROR SIGNUP" });
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
app.post('/login', async (req, res) => {
    try{
        const { email, clave } = req.body
        const isAdmin = true;
    
        const user = await MongoUsers.findByUser(email, clave)
        console.log(user)
        req.session.rank = user.rank
        req.session.mail = email
        res.redirect('/admin')
    }catch(e){
        res.redirect("/?error=true");
    }

    req.session.isAdmin = isAdmin;
    req.session.user = email
    req.session.pass = clave

    return res.redirect('/admin')
})


//REGISTRO
app.post('/register', async (req, res) => {
    const { nombre, email, clave } = req.body
    await MongoUsers.save({ nombre, email, clave })
    req.session.usuario = nombre
    req.session.mail = email
    req.session.rank = 0
    res.redirect('/admin')
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


app.listen(8081, () => console.log("conectados"));