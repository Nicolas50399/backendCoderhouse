class Product{
    constructor(nombre, marca){
        this.nombre = nombre
        this.marca = marca
    }
    tipoProducto(){
        return "El producto " + this.nombre + ", marca " + this.marca + " es de tipo " + this.type
    }
}

module.exports = Product