const { optionsMariaDB } = require('./options/mariaDB.js')
const knex = require('knex')(optionsMariaDB);

//const db = require("../main.js");
//const DB = new db();



class ContenedorBDD{
    constructor(options){
        this.options = options
    }

    async crearTabla(nameTable){
        await knex.schema.createTable(`${nameTable}`, table => {
            
            switch(nameTable){
                //id, timestamp, nombre, descripcion, codigo, foto_url, precio, stock
                case 'productos': {
                    table.increments('id')
                    table.timestamp('timestamp').defaultTo(knex.fn.now())
                    table.string('nombre')
                    table.string('descripcion')
                    table.string('foto_url')
                    table.float('precio')
                    table.integer('stock')
                }
                break;
                case 'mensajes': {
                    table.increments('id')
                    table.string('email')
                    table.timestamp('timestamp').defaultTo(knex.fn.now())
                    table.string('mensaje')
                }
            }
            
        })
        .then(() => console.log(`Tabla ${nameTable} creada`))
        .catch((e) => {console.log(e); throw e})
        .finally(() => {
            knex.destroy();
        })
    }

    async insertarDato(object, nameTable){
        try {
            switch(nameTable){
                case 'productos': {
                    await knex(`${nameTable}`).insert({
                        timestamp: object.timestamp,
                        nombre: object.nombre,
                        descripcion: object.descripcion,
                        foto_url: object.fotoUrl,
                        precio: object.precio,
                        stock: object.stock
                    })
                }
                break;
                case 'mensajes': {
                    await knex(`${nameTable}`).insert({
                        email: object.email,
                        timestamp: object.timestamp,
                        mensaje: object.mensaje
                    })
                }
            }
           
            console.log(`Dato de ${nameTable} insertado!`)
        }
        catch (e) {
            console.log('no se pudo acceder a la base de datos');
        }
        return producto.id;
    }

    async obtenerDatoPorId(id, nameTable){
        try {
            await knex.from(`${nameTable}`)
            .select('*')
            .where({id: id})
            console.log(`Dato de ${nameTable} obtenido!`)
        }
        catch (e) {
            console.log('no se pudo acceder a la base de datos');
        }
    }

    async obtenerDatos(nameTable){
        try {
            await knex.from(`${nameTable}`)
            .select('*')
            console.log(`Datos de ${nameTable} obtenidos!`)
        }
        catch (e) {
            console.log('no se pudo acceder a la base de datos');
        }
    }

    async borrarDatoPorId(id, nameTable){
        try {
            knex(`${nameTable}`)
            .where({id: id})
            .del()
            console.log(`Dato de ${nameTable} borrado!`)
        }
        catch (e) {
            console.log('no se pudo acceder a la base de datos');
        }
    }

    async borrarDatos(nameTable){
        try {
            knex(`${nameTable}`)
            .del()
            console.log(`Tabla ${nameTable} vaciada!`)
        }
        catch (e) {
            console.log('no se pudo acceder a la base de datos');
        }
    }
}

module.exports = ContenedorBDD;