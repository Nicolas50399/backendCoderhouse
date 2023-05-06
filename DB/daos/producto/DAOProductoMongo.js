const ContenedorMongo = require("../../containers/contenedorMongo.js");
const configProductos  = require("../../configs/configProductos.js")

class DAOProductoMongo extends ContenedorMongo {
  constructor() {
    super(configProductos.mongoDB.collection, configProductos.mongoDB.model);
  }
}
module.exports = DAOProductoMongo;