const logger = require("../../logger.js")
const multer = require('multer');
const path = require('path')
let imageName
const { newProducto, Products, findProductos, allProducts, oneProduct, deleteProduct, updateProduct } = require("../services/productoServ.js")

const storage = multer.diskStorage({
    destination: path.join(__dirname, "../../uploads/products"),
    filename: function (req, file, cb) {
        // generate the public name, removing problematic characters
        const originalName = encodeURIComponent(path.parse(file.originalname).name).replace(/[^a-zA-Z0-9]/g, '')
        const timestamp = Date.now()
        const extension = path.extname(file.originalname).toLowerCase()
        imageName = originalName + '_' + timestamp + extension
        cb(null, imageName)
    }
})

const upload = multer({
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


async function getProductos(req, res){
    try {
        await allProducts(req, res)
    } catch (e) {
        logger.error(`Error en api de productos: ${e}`)
    }
}

async function getProducto(req, res){
    try {
        await oneProduct(req, res)
    } catch(e){
        logger.error(`Error en api de productos: ${e}`)
    }
}

async function addProducto(req, res){
    try{
        const { nombre, marca, descripcion, categoria, precio, foto, cantidad } = req.body
        console.log(req.file)
        const newProduct = {
            nombre: nombre,
            descripcion: descripcion,
            marca: marca,
            categoria: categoria,
            precio: precio,
            foto: imageName,
            cantidad: cantidad
        }
        await newProducto(newProduct)
        return res.redirect('/agregarProductos')
    }
    catch(e){
        logger.error(`Error en api de productos: ${e}`)
    }
}

function getAgregarProducto(req, res){
    res.render('home', { layout: "agregarProductos", name: req.session.usuario });
}

async function removeProducto(req, res){
    try{
        await deleteProduct(req, res)
    } catch(e){
        logger.error(`Error en api de productos: ${e}`)
    }
}

async function setProducto(req, res){
    try{
        await updateProduct(req, res, imageName)
    } catch(e){
        logger.error(`Error en api de productos: ${e}`)
    }
}

module.exports = { getProductos, addProducto, getAgregarProducto, getProducto, removeProducto, setProducto, upload, imageName }