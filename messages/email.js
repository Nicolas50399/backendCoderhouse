const nodemailer = require('nodemailer');
const logger = require('../logger');
const dotenv = require('dotenv').config()

async function Mail(receptor, asunto, usuario, email, telefono, productos, total){
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        auth: {
            user: process.env.GMAIL,
            pass: process.env.GMAILPASS
        }
    });
    
    let html = ""
    switch (asunto) {
        case 'Pedido de compra':
            html += `<h1>Nuevo pedido de compra</h1>
                    <h2>Usuario: ${usuario}</h2>
                    <h2>Email: ${email}</h2>
                    <h2>Telefono: ${telefono}</h2>
                    <br><br>
                    <h2>PRODUCTOS</h2>
                    <table>
                        <thead>
                            <tr style="color: red">
                                <th>Nombre</th>
                                <th>Marca</th>
                                <th>Precio</th>
                            </tr>
                        </thead>
                        <tbody>`
            productos.forEach(producto => {
                html += `<tr>
                            <th>${producto.nombre}</th>
                            <th>${producto.marca}</th>
                            <th>$${producto.precio}</th>
                        </tr>`
            });
            html += `</tbody></table><br><br>
                    <h2>TOTAL: $${total}</h2>`
            break;
        
        case 'Registro':
            html += `<h1>Nuevo registro</h1>
            <h2>Usuario: ${usuario}</h2>
            <h2>Email: ${email}</h2>
            <h2>Telefono: ${telefono}</h2>
            `
            break;
        default:
            break;
    }

    const mailOptions = {
        from: process.env.GMAIL,
        to: receptor,
        subject: asunto,
        html: html
    }
    
    try {
        const info = await transporter.sendMail(mailOptions)
        //console.log(info)
        logger.info("MAIL ENVIADO!")
    }catch(e){
        logger.info("ERROR AL MANDAR MAIL: " + e)
    }
}

module.exports = { Mail }