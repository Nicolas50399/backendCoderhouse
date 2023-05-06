const ContenedorMongo = require("../../containers/contenedorMongo.js")
const configUsuarios  = require("../../configs/configUsuarios.js");

class DAOUsuarioMongo extends ContenedorMongo {
    constructor() {
        super(configUsuarios.mongoDB.collection, configUsuarios.mongoDB.model);
      }
}

module.exports = DAOUsuarioMongo;