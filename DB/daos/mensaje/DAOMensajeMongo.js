const ContenedorMongo = require("../../containers/contenedorMongo.js");
const configMensajes  = require("../../configs/configMensajes.js")

class DAOMensajeMongo extends ContenedorMongo {
    constructor() {
      super(configMensajes.mongoDB.collection, configMensajes.mongoDB.model);
    }
  }
  module.exports = DAOMensajeMongo;