const socket = io.connect()

function render(data){
    const html = data.map((elem, index) => {
        return(`<div>
        <p style="display: flex;">${elem.timestamp}</p>
        <p style="display: flex;">[${elem.tipo}] <strong style="color: greenyellow;">${elem.email}</strong>:  ${elem.cuerpo}</p>
        </div>`)
    }).join(" ");
    document.getElementById('messages').innerHTML = html;
}

socket.on('messages', function(data) { render(data); })

function addMessage(e){

    const fechaHoraActual = new Date();
    const anio = fechaHoraActual.getFullYear();
    const mes = fechaHoraActual.getMonth() + 1; // Los meses se representan de 0 a 11
    const dia = fechaHoraActual.getDate();
    const hora = fechaHoraActual.getHours();
    const minutos = fechaHoraActual.getMinutes();
    const segundos = fechaHoraActual.getSeconds();

    const mensaje = {
        email: document.getElementById('usermail').innerHTML,
        tipo: document.getElementById('usertype').innerHTML,
        timestamp: `${dia}/${mes}/${anio} - ${hora}:${minutos}:${segundos}`,
        cuerpo: document.getElementById('inputMensaje').value
    }

    socket.emit('new-message', mensaje)
    return false
}

