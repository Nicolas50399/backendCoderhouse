const twilio = require('twilio');
const logger = require('../logger');
const dotenv = require('dotenv').config()

const client = twilio(process.env.SMSACCOUNT, process.env.SMSTOKEN)

async function SMS(receptor, asunto){
    let msg
    switch (asunto) {
        case 'Pedido realizado':
            msg = "Su pedido se encuentra en proceso"
            break;
    
        default:
            break;
    }

    const smsOptions = {
        body: msg,
        from: process.env.SMSFROM,
        to: "+54"+receptor
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