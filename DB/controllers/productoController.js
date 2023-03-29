const mongoose = require("mongoose")

const configProductos  = require("../configs/configProductos.js")

const Products = mongoose.model(configProductos.mongoDB.collection, configProductos.mongoDB.model)



module.exports = { Products }