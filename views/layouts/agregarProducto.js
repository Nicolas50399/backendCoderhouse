const socket = io.connect();
socket.on('productsList', data => {
    console.log(data)
})

function render(data){
    const html = data.map((elem, index) => {
        return(`<th>
            <tr>${elem.name}</tr>
            <tr>${elem.marca}</tr>
            <tr>${elem.price}</tr>
            </th>`)
    })
    document.getElementById('productsList').innerHTML = html
}

socket.on('productsList', (data) => {
    render(data)
})

function addProduct(e){
    const producto = {
        name: document.getElementById('username').value,
        marca: document.getElementById('texto').value,
        price: document.getElementById('texto').value
    }
    socket.emit('new-product', producto)
    return false
}