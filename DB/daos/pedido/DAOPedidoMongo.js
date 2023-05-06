const ContenedorMongo = require("../../containers/contenedorMongo.js");
const configPedidos  = require("../../configs/configPedidos.js")

class DAOPedidoMongo extends ContenedorMongo {
  constructor() {
    super(configPedidos.mongoDB.collection, configPedidos.mongoDB.model);
  }
}
module.exports = DAOPedidoMongo;