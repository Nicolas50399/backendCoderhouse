const logger = require("../../logger.js")
const DAOMensajeMongo = require("../daos/mensaje/DAOMensajeMongo");

const Messages = new DAOMensajeMongo()


async function allMessages(req, res){
    await Messages.findAll((err, messages) => {
        if(err) logger.error("Error al cargar los productos: " + err)

        let rank;
        let email = req.session.mail;
        if(req.session.rank == 1){
            rank = "USUARIO"
        }
        else if(req.session.rank == 2){
            rank = "ADMINISTRADOR"
        }
        res.render('home', {
            layout: "mensajes",
            user: email,
            type: rank,
            mensajes: messages
        })
    })
}

async function newMensaje(mensaje){
    await Messages.save(mensaje, (err) => {
        if(err){
            logger.error("error al guardar mensaje: " + err)
        }
        logger.info("mensaje guardado!")
    })
}

async function mensajesPropios(req, res){
    const { email } = req.params
    await Messages.findByFilters({"email": email}, async (err, messages) => {
        if(err){
            logger.error("error al encontrar los mensajes: " + err)
        }
        if(!product){
            logger.error("Los mensajes no se encuentran en el sistema ")
        }
        res.render('home', { 
            layout: "mensajesPropios", 
            mensajes: messages
         })
    })
}

module.exports = { allMessages, newMensaje, mensajesPropios }