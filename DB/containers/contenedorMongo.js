const mongoose = require("mongoose")
const config  = require("../configs/config.js")
const configUsuarios  = require("../configs/configUsuarios.js")

const asPOJO = (obj) => JSON.parse(JSON.stringify(obj));

const renameField = (record, from, to) => {
  record[to] = record[from];
  delete record[from];
  return record;
};
const removeField = (record, field) => {
  const value = record[field];
  delete record[field];
  return value;
};

mongoose.connect(configUsuarios.mongoDB.uri, configUsuarios.mongoDB.options);

class ContenedorMongo {
  
  constructor(coleccion, esquema) {
    this.db = mongoose.model(coleccion, esquema);
  }

  async findById(id) {
    try {
      const data = await this.db.findOne({ _id: id });
      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async findByUser(email, password) {
    try{
      const data = await this.db.find(
        { email, password },
        { __v: 0 }
      );
      if (data.length == 0) {
        throw new Error("Error al listar por usuario: no encontrado");
      } else {
        const result = renameField(asPOJO(data[0]), "_id", "id");
        return result;
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  async findAll() {
    try {
      let data = await this.db.find({}, { __v: 0 }).lean();
      data = data.map(asPOJO);
      data = data.map((d) => renameField(d, "_id", "id"));
      return data;
    } catch (e) {
      throw new Error(e);
    }
  }

  async save(newDoc) {
    try {
      const doc = await this.db.create(newDoc);
      doc = asPOJO(doc);
      renameField(doc, "_id", "id");
      removeField(doc, "__v");
      return doc;
    } catch (e) {
      throw new Error(e);
    }
  }

  async insertMany(newDocs){
    try{
        const { n, nInserted} = await this.db.insertMany(newDocs);
        return nInserted > 0;
    }catch (e) {
      throw new Error(e);
    }
  }

  async update(elem) {
    try {
      renameField(elem, "id", "_id");
      const { n, nModified } = await this.db.replaceOne(
        { _id: elem._id },
        elem
      );
      if (n == 0 || nModified == 0) {
        throw new Error("Error al actualizar: no encontrado");
      } else {
        renameField(elem, "_id", "id");
        removeField(elem, "__v");
        return asPOJO(elem);
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  async updateMany(elems) {
    try{
        const { n, nModified } = await this.db.updateMany(
            { _id: {$in: elems.map(e => e._id)}, elems}
        );
        return nModified > 0;
    } catch (e) {
        throw new Error(e);
      }
  }

  async delete(id) {
    try {
      const { n, nDeleted } = await this.db.deleteOne({ _id: id });
      if (n == 0 || nDeleted == 0) {
        throw new Error("Error al borrar: no encontrado");
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  async deleteAll() {
    try{
      await this.db.deleteMany({});
    } catch (e) {
      throw new Error(e);
    } 
  }
}

module.exports = ContenedorMongo;