const express = require('express');
const cookieParser = require('cookie-parser')
const session = require('express-session')

const MongoStore = require('connect-mongo')
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }

const app = express();

const db = require("./containers/ContenedorArchivos.js")
const DB = new db();

app.use(cookieParser())

const handlebars = require("express-handlebars");

app.set('views', './views/');

const hbs = handlebars.engine({
    extname: 'hbs',
    layoutsDir: './views/layouts/'
})

app.engine('hbs', hbs)

app.set('view engine', 'hbs');

//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

app.get("/", (req, res) => {
    if (req.session.user) {
        res.redirect('/admin')
    } else {
        res.redirect('/login')
    }

});

app.get('/admin', auth, adminAuth, async (req, res) => {
    const data = await DB.getAll('productos.txt')
    res.render('home', { layout: "productos", productos: data, name: req.session.user })
})

app.get('/agregarProductos', (req, res) => {
    res.render('home', { layout: "agregarProductos" });
});

app.post('/api/productos', async (req, res) => {
    const { nombre, marca, precio } = req.body
    console.log(req.body)
    const id = await DB.save({ nombre, marca, precio }, 'productos.txt')
    console.log(id)
    //res.send({error: false, msg: 'Producto agregado con id' + id})
    return res.redirect('/agregarProductos')
})

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


app.post('/admin', (req, res) => {
    const { nombre, clave } = req.body
    const isAdmin = true;

    req.session.isAdmin = isAdmin;
    req.session.user = nombre
    req.session.pass = clave

    return res.redirect('/admin')
})

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