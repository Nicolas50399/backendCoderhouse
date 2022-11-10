import mongoose, { mongo } from "mongoose";
import * as model from './models/usuario.js'

CRUD()

async function CRUD(){
    try{
        const URL = 'mongodb://localhost:27017/ecommerce'
        let rta = await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('base de datos conectada')

        console.log('CREATE')
        const usuario =  {
            nombre: 'Nicolas',
            email: 'nico@gmail.com',
            password: 123456
        }
        const usuarioSaveModel = new model.usuarios(usuario);
        let usuarioSave = await usuarioSaveModel.save()
        console.log(usuarioSave)

        console.log('UPDATE')
        let usuarioUpdate = await model.usuarios.updateOne(
            {nombre: 'Nicolas'}, { $set: {password: 654321}})
        console.log(usuarioUpdate)

        console.log('READ')
        usuarios = await model.usuarios.find({nombre: 'Nicolas'})
        console.log(model.usuarios)

        console.log('UPDATE')
        let usuarioDelete = await model.usuarios.deleteOne(
            {nombre: 'Nicolas'})
        console.log(usuarioDelete)

        console.log('READ')
        usuarios = await model.usuarios.find({nombre: 'Nicolas'})
        console.log(model.usuarios)


        console.log('CREATE (4 usuarios)')
        await new model.usuarios({
            nombre: 'Federico',
            email: 'fede@gmail.com',
            password: 111222
        }).save()
        await new model.usuarios({
            nombre: 'Miguel',
            email: 'migue@gmail.com',
            password: 201111
        }).save()
        await new model.usuarios({
            nombre: 'Noelia',
            email: 'noe@gmail.com',
            password: 311991
        }).save()
        await new model.usuarios({
            nombre: 'Lorena',
            email: 'lore@gmail.com',
            password: 222016
        }).save()

        console.log('READ PROJECTION + FILTER')
        console.log(await model.usuarios.find({nombre: 'Nicolas'},{nombre:1, email: 1, _id: 0}))
        console.log(await model.usuarios.find({nombre: 'Miguel'},{nombre:1, email: 1, _id: 0}))

        console.log('READ PROJECTION + SORT')
        console.log(await model.usuarios.find({}, {nombre:1, _id: 0}).sort({nombre: -1}))

        console.log('READ PROJECTION + SORT + SKIP')
        console.log(await model.usuarios.find({}, {nombre:1, _id: 0}).sort({nombre: -1}).skip(1))
        
        console.log('READ PROJECTION + SORT + SKIP + LIMIT')
        console.log(await model.usuarios.find({}, {nombre:1, _id: 0}).sort({nombre: -1}).skip(1).limit(2))
    }
    catch(e){
        console.log("Error en el CRUD: " + e)
    }
}