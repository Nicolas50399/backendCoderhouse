module.exports = {
    mongoDB: {
      uri: `mongodb://localhost:27017/backend`,
      options: {
        useNewUrlParser: true, useUnifiedTopology: true
      },
      collection: 'products',
      model: {
        nombre: String,
        marca: String,
        precio: Number,
        foto: String
      },
    },
  };