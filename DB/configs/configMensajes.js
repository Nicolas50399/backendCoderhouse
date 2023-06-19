module.exports = {
    mongoDB: {
      uri: `mongodb://localhost:27017/backend`,
      options: {
        useNewUrlParser: true, useUnifiedTopology: true
      },
      collection: 'messages',
      model: {
        email: String,
        tipo: String,
        timestamp: String,
        cuerpo: String
      },
    },
  };