const optionsMariaDB = {
    client: 'mysql',
    connection: {
        host : '127.0.0.1',
        user : 'root',
        password : 'Campana1324',
        database : 'productos_coder'
    },
    pool: { min: 0, max: 7 }
}

module.exports = {
    optionsMariaDB
}