const Product = require("./product");

class ProductoBarato extends Product{
    constructor(){
        super()
        this.type = "BARATO"
    }
}

module.exports = ProductoBarato;