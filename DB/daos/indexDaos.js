import * as dotenv from "dotenv";
dotenv.config();
console.log(process.env.TIPO);
const daos = {
  mongo: async () => {
    const { default: DAOProductoMongo } = await import(
      "./producto/DAOProductoMongo.js"
    );
    const { default: DAOCarritoMongo } = await import(
      "./carrito/DAOCarritoMongo.js"
    );
    const { default: DAOUsuarioMongo } = await import(
      "./usuario/DAOUsuarioMongo.js"
    );
    return {
      carritoDAO: new DAOCarritoMongo(),
      productoDAO: new DAOProductoMongo(),
      usuarioDAO : new DAOUsuarioMongo()
    };
  },
  firebase: async () => {
    const { default: DAOProductoFirebase } = await import(
      "./producto/DAOProductoFirebase.js"
    );
    const { default: DAOCarritoFirebase } = await import(
      "./carrito/DAOCarritoFirebase"
    );
    return {
      carritoDAO: new DAOCarritoFirebase(),
      productoDAO: new DAOProductoFirebase(),
    };
  },
};

export default daos[process.env.TIPO];