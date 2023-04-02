const mongoose = require("mongoose")

const configPedidos  = require("../configs/configPedidos.js")

const Orders = mongoose.model(configPedidos.mongoDB.collection, configPedidos.mongoDB.model)

module.exports = { Orders }