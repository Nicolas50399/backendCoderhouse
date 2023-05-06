const Product = require("./product");

class ProductoMedio extends Product{
    constructor(){
        super();
        this.type = "MEDIO";
    }
}

module.exports = ProductoMedio