const twilio = require('twilio');
const logger = require('../logger');
const Prefijos = require('./prefijos');
const dotenv = require('dotenv').config()

const client = twilio(process.env.SMSACCOUNT, process.env.SMSTOKEN)

async function WSP(receptor, asunto, usuario, email, telefono, productos, pais){
    let msg = ""
    let prefijo
    switch (asunto) {
        case 'Pedido de compra':
            msg += `Nuevo pedido de compra\nUsuario: ${usuario}\nEmail: ${email}\nTelefono: ${telefono}\n\nPRODUCTOS\n`
            productos.forEach(producto => {
                msg += `${producto.nombre}\n${producto.marca}\n $${producto.precio}\n\n`
            });
            prefijo = (Prefijos.find(p => p.name == pais)).dial_code
            break;
    
        default:
            break;
    }

    const smsOptions = {
        body: msg,
        from: "whatsapp:"+process.env.WSPFROM,
        to: "whatsapp:"+prefijo+"9"+receptor
    }

    try{
        const message = await client.messages.create(smsOptions)
        logger.info("Whatsapp ENVIADO!")
    }
    catch(e){
        logger.info("ERROR AL MANDAR Whatsapp: " + e)
    }
    
}

module.exports = { WSP }