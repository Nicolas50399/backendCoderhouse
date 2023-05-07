const twilio = require('twilio');
const logger = require('../logger');
const Prefijos = require('./prefijos');
const dotenv = require('dotenv').config()

const client = twilio(process.env.SMSACCOUNT, process.env.SMSTOKEN)

async function SMS(receptor, asunto, pais){
    let msg
    let prefijo
    switch (asunto) {
        case 'Pedido realizado':
            msg = "Su pedido se encuentra en proceso"
            prefijo = (Prefijos.find(p => p.name == pais)).dial_code
            break;
    
        default:
            break;
    }


    const smsOptions = {
        body: msg,
        from: process.env.SMSFROM,
        to: prefijo+receptor
    }

    try{
        const message = await client.messages.create(smsOptions)
        logger.info("SMS ENVIADO!")
    }
    catch(e){
        logger.info("ERROR AL MANDAR SMS: " + e)
    }

}

module.exports = { SMS }