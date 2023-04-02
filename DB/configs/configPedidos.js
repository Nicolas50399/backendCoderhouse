module.exports = {
    mongoDB: {
      uri: `mongodb://localhost:27017/backend`,
      options: {
        useNewUrlParser: true, useUnifiedTopology: true
      },
      collection: 'orders',
      model: {
        nombreUsuario: String,
        email: String,
        telefono: String,
        productos: [{
            nombre: String,
            marca: String,
            precio: Number
        }]
      },
    },
  };