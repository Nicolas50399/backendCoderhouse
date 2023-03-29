const mongoose = require("mongoose")

const configUsuarios  = require("../configs/configUsuarios.js")

function DBConnect(cb){
    mongoose.connect(configUsuarios.mongoDB.uri, configUsuarios.mongoDB.options, (err) => {
        console.log('conectado')
        if(err) console.log(err);
        cb()
    })
}

const Users = mongoose.model(configUsuarios.mongoDB.collection, configUsuarios.mongoDB.model)



module.exports = { DBConnect, Users }