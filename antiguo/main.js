const express = require('express');

const app = express();
const db = require("../containers/ContenedorArchivos.js")

const handlebars = require("express-handlebars");

const DB = new db();




//views
app.set('views', './views/');

//view engine
const hbs = handlebars.engine({
    extname: 'hbs',
    layoutsDir: './views/layouts/'
})

app.engine('hbs', hbs)

app.set('view engine', 'hbs');

//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//frontend

app.get('/agregarProductos', (req, res) => {
    res.render('home', {layout: "agregarProductos"});
});

app.post('/api/productos', async(req, res) => {
    const {nombre, marca, precio} = req.body
    console.log(req.body)
    const id = await DB.save({nombre, marca, precio}, 'productos.txt')
    console.log(id)
    //res.send({error: false, msg: 'Producto agregado con id' + id})
    return res.redirect('/agregarProductos')
})

app.get('/admin', async(req, res) => {
    const data = await DB.getAll('productos.txt')
    res.render('home', { layout: "productos", productos: data})
})

app.get('/producto/:id', async (req, res) => {
    const {id} = req.params
    try {
        const data = await DB.getById(id, 'productos.txt')
        console.log(data)
        if(data == -1){
            return res.status(404).render('home', { layout: "error" })
        }
        else{
            return res.render('home', { layout: "producto", ...data })
        }
    } catch (e) {
        return res.status(404).render('home', { layout: "error" })
    }
})



app.listen(3000, () => {
    console.log("Servidor listo")
});