class Producto{
    #nombre
    #marca
    #precio

    constructor({ nombre, marca, precio }){
        this.nombre = nombre
        this.marca = marca
        this.precio = precio
    }

    get nombre() { return this.#nombre }

    set nombre(nombre){
        if(!nombre) throw new Error("se requiere del campo: nombre");
        this.#nombre = nombre;
    }


    get marca() { return this.#marca }

    set marca(marca){
        if(!marca) throw new Error("se requiere del campo: marca");
        this.#marca = marca;
    }


    get precio() { return this.#precio }

    set precio(precio){
        if(!precio) throw new Error("se requiere del campo: precio");
        if(isNaN(precio)) throw new Error("el precio debe ser numerico");
        if(precio <= 0) throw new Error("el precio debe ser positivo");
        this.#precio = precio;
    }
}

module.exports = Producto