const Product = require("./product");

class ProductoCaro extends Product{
    constructor(){
        super()
        this.type = "CARO"
    }
}

module.exports = ProductoCaro