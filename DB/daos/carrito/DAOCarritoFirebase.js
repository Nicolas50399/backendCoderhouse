import ContenedorMongo from "../../containers/contenedorFirebase.js";

class DAOCarritoFirebase extends ContenedorMongo {
  constructor() {
    // * super = padre/ContenedorMongo
    super("carrito", {
        products: { type: [], required: true, default: [] }
    });
  }
  
}
export default DAOCarritoFirebase;