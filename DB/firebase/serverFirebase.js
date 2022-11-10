const { query } = require("express");
var admin = require("firebase-admin");

var serviceAccount = require("./basebackendcoder-firebase-adminsdk-l4oi1-e89f6ea795.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

console.log("Base Firebase conectada!")

CRUD()

async function CRUD(){
    //*CREATE
    const db = admin.firestore();
    const query = db.collection('usuarios')
    try{
        let id = 1
        let doc = query.doc(`${id}`)
        await doc.create({ nombre: 'Nico', dni: 19990503})
        id++
        doc = query.doc(`${id}`)
        await doc.create({ nombre: 'Fede', dni: 20011207})
        id++
        doc = query.doc(`${id}`)
        await doc.create({ nombre: 'Miguel', dni: 20100511})
        console.log('Datos insertados')
    }
    catch(e){console.log(e)}

    //*READ ALL
    try{
        const querySnapshot = await query.get()
        let docs = querySnapshot.docs;
        const response = docs.map((doc) => ({
            id: doc.id,
            nombre: doc.data().nombre,
            dni: doc.data().dni
        }))
        console.log(response)
    }
    catch(e){console.log(e)}

    //*READ ID
    try{
        let id = 2
        const doc = query.doc(`${id}`)
        const item = await doc.get()
        const response = item.data()
        console.log(response)
    }
    catch(e){console.log(e)}

    //*UPDATE
    try{
        let id = 3
        const doc = query.doc(`${id}`)
        const item = await doc.update({ dni: 20110511})
        console.log("El usuario fue ACTUALIZADO", item)
    }
    catch(e){console.log(e)}

    //*DELETE
    try{
        let id = 1
        const doc = query.doc(`${id}`)
        const item = await doc.delete()
        console.log("El usuario fue ELIMINADO", item)
    }
    catch(e){console.log(e)}
}

