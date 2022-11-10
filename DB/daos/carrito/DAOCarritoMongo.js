import ContenedorMongo from "../../containers/contenedorMongo.js";

class DAOCarritoMongo extends ContenedorMongo {
  constructor() {
    // * super = padre/ContenedorMongo
    super("carrito", {
        products: { type: [], required: true, default: [] }
    });
  }
  
}
export default DAOCarritoMongo;