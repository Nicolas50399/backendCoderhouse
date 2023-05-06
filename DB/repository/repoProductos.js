const DAOProductoMongo = require("../daos/producto/DAOProductoMongo")
const Producto = require("./producto")

class RepoProductos{
    constructor(){
        this.dao = new DAOProductoMongo()
    }

    async getAll() {
        await this.dao.findAll((err, products) => {
            if(err) logger.error("Error al cargar los productos: " + err)
            return products.map(p => new Producto(p))
        })
    }

    async add(product) {
        const dto = new Producto(product)
        return await this.dao.save(dto, (err) => {
            if(err){
                logger.error("error al guardar producto: " + err)
            }
            else logger.info("producto guardado!")
        })
    }

    async removeOne(filters){
        return await this.dao.deleteByFilters(filters, (err) => {
            if(err) logger.error('Error al borrar el producto: ' + err)
            else logger.info('Producto borrado!')
        })
    }
}

module.exports = RepoProductos