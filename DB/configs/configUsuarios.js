module.exports = {
    mongoDB: {
      uri: `mongodb://localhost:27017/backend`,
      options: {
        useNewUrlParser: true, useUnifiedTopology: true
      },
      collection: 'users',
      model: {
        nombre: String,
        email: String,
        clave: String,
        direccion: String,
        pais: String,
        telefono: String,
        foto: String,
        rank: Number
      },
    },
  };