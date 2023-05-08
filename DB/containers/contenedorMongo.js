const mongoose = require("mongoose")
const config  = require("../configs/config.js")
const configUsuarios  = require("../configs/configUsuarios.js")

//mongoose.connect(configUsuarios.mongoDB.uri, configUsuarios.mongoDB.options);

class ContenedorMongo {
  
  constructor(coleccion, esquema) {
    this.db = mongoose.model(coleccion, esquema);
  }

  async findById(id, done){
    try {
      await this.db.findById(id, done).clone()
    } catch (e) {
      throw new Error(e);
    }
  }

  async findByFilters(filters, callback) {
    try {
      await this.db.findOne(filters, (err, object) => {
        callback(err, object)
    }).clone()
    } catch (e) {
      throw new Error(e);
    }
  }

  async findAll(callback) {
    try {
      await this.db.find({}, (err, objects) => {
        callback(err, objects)
    }).lean().clone()
    } catch (e) {
      throw new Error(e);
    }
  }

  async save(newDoc, callback) {
    try {
      await this.db.create(newDoc, (err, obj) => {
        callback(err, obj)
       });
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteByFilters(filters, callback) {
    try {
      await this.db.deleteOne(filters, (err) => {
        callback(err)
    }).clone();
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteAll() {
    try{
      await this.db.deleteMany({}).clone();
    } catch (e) {
      throw new Error(e);
    } 
  }

  async updateByFilters(filters, updates){
    try {
      await this.db.updateOne(filters, {$set:updates}).clone();
    } catch (e) {
      throw new Error(e);
    }
  }
}

module.exports = ContenedorMongo;