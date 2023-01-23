const ContenedorMongo = require("../../containers/contenedorMongo.js")

class DAOUsuarioMongo extends ContenedorMongo {
    constructor() {
        super("usuarios", {
          username: { type: String, required: true },
          email: { type: String, required: true },
          password: { type: String, required: true },
          // 0 usuario, 1 mod, 2 admin
          rank: { type: Number, required: true, default: 0 },
        });
      }
}

module.exports = DAOUsuarioMongo;