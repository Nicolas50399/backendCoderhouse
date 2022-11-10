const { query } = require("express");
var admin = require("firebase-admin");


var serviceAccount = require("../firebase/basebackendcoder-firebase-adminsdk-l4oi1-e89f6ea795.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

class ContenedorFirebase {
  
    constructor() {
      this.db = admin.firestore();
    }

    
  
    async findById(id) {
        //*const query = this.db.collection('productos')
      try {
        const doc = query.doc(`${id}`)
        const item = await doc.get()
        const response = item.data()
        console.log(response)
      } catch (e) {
        throw new Error(e);
      }
    }
  
    async findAll() {
        //*const query = this.db.collection('productos')
      try {
        const querySnapshot = await query.get()
        let docs = querySnapshot.docs;
        const response = docs.map((doc) => ({
            id: doc.id,
            timestamp: doc.data().timestamp,
            nombre: doc.data().nombre,
            descripcion: doc.data().descripcion,
            foto_url: doc.data().foto_url,
            precio: doc.data().precio,
            stock: doc.data().stock
        }))
        console.log(response)
      } catch (e) {
        throw new Error(e);
      }
    }
  
    async save(newDoc) {
        //*const query = this.db.collection('productos')
      try {
        let doc = query.doc(`${newDoc.id}`)
        await doc.create({ 
            timestamp: newDoc.timestamp,
            nombre: newDoc.nombre,
            descripcion: newDoc.descripcion,
            foto_url: newDoc.foto_url,
            precio: newDoc.precio,
            stock: newDoc.stock
        })
        console.log('Datos insertados')
      } catch (e) {
        throw new Error(e);
      }
    }
  
    async insertMany(newDocs){
        //*const query = this.db.collection('productos')
      try{
        let doc
        newDocs.forEach(async (d) =>{
            doc = query.doc(`${d.id}`)
            await doc.create({ 
                timestamp: d.timestamp,
                nombre: d.nombre,
                descripcion: d.descripcion,
                foto_url: d.foto_url,
                precio: d.precio,
                stock: d.stock
            })
        })
        console.log('Datos insertados')
      }catch (e) {
        throw new Error(e);
      }
    }
  
    async update(id, updated) {
        //*const query = this.db.collection('productos')
      try {
        const doc = query.doc(`${id}`)
        const item = await doc.update(updated)
        console.log("El producto fue ACTUALIZADO", item)
      } catch (e) {
        throw new Error(e);
      }
    }
  
    async updateMany(ids, updates) {
        //*const query = this.db.collection('productos')
      try{
        for(let i=1;i<=ids.length;i++){
            const doc = query.doc(`${ids[i]}`)
            const item = await doc.update(updates[i])
            console.log("El producto fue ACTUALIZADO", item)
        }
      } catch (e) {
          throw new Error(e);
        }
    }
  
    async delete(id) {
        //*const query = this.db.collection('productos')
      try {
        const doc = query.doc(`${id}`)
        const item = await doc.delete()
        console.log("El producto fue ELIMINADO", item)
      } catch (e) {
        throw new Error(e);
      }
    }
  
    async deleteAll() {
        //*const query = this.db.collection('productos')
        try {
            const products = this.findAll()
            products.forEach(async (p) => {
                const doc = query.doc(`${p.id}`)
                const item = await doc.delete()
                console.log("El producto fue ELIMINADO", item)
            })
          } catch (e) {
            throw new Error(e);
          }
    }
  }
  
  export default ContenedorFirebase