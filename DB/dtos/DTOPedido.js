class PedidoDto{
    constructor(usuario, productos){
        this.nombre = usuario.name
        this.email = usuario.email
        this.telefono = usuario.telefono
        this.productos = []
        for(let i = 0; i < productos.length; i++){
            this.productos.push({
                nombre: productos[i].nombre,
                marca: productos[i].marca,
                precio: productos[i].precio,
                cantidad: productos[i].cantidad
            })
        }
    }
}

module.exports = PedidoDto;