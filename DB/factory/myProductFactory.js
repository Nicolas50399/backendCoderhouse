const ProductoCaro = require("./products/productoCaro")
const ProductoMedio = require("./products/productoMedio")
const ProductoBarato = require("./products/productoBarato")

class MyProductFactory{
    createProduct(data) {
        if(data.precio < 5000) return new ProductoBarato(data.nombre, data.marca)
        else if(data.precio >= 5000 && data.precio <= 50000) return new ProductoMedio(data.nombre, data.marca)
        else return new ProductoCaro(data.nombre, data.marca)
    }
}

module.exports = MyProductFactory