const ContenedorMongo = require("../../containers/contenedorMongo.js")

class DAOUsuarioMongo extends ContenedorMongo {
    constructor() {
        super("usuarios", {
          nombre: { type: String, required: true },
          email: { type: String, required: true },
          clave: { type: String, required: true },
          direccion: { type: String, required: true },
          telefono: { type: String, required: true },
          foto: { type: String, required: true }
          // 0 usuario, 1 mod, 2 admin
          //rank: { type: Number, required: true, default: 0 },
        });
      }
}

module.exports = DAOUsuarioMongo;