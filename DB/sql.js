const { optionsMariaDB } = require('./options/mariaDB.js')
const knex = require('knex')(optionsMariaDB);

//const db = require("../main.js");
const { default: knex } = require('knex');
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
                }
            }
            
        })
        .then(() => console.log(`Tabla ${nameTable} creada`))
        .catch((e) => {console.log(e); throw e})
        .finally(() => {
            knex.destroy();
        })
    }

    async insertarDato(producto, nameTable){
        try {
            switch(nameTable){
                case 'productos': {
                    await knex(`${nameTable}`).insert({
                        timestamp: producto.timestamp,
                        nombre: producto.nombre,
                        descripcion: producto.descripcion,
                        foto_url: producto.fotoUrl,
                        precio: producto.precio,
                        stock: producto.stock
                    })
                }
                break;
                case 'mensajes': {
                    await knex(`${nameTable}`).insert({
                        
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