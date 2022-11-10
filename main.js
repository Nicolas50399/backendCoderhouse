const fs = require('fs');

class Contenedor {
    constructor(nameFile) {
        this.file = nameFile;
    }

    async createFile(nameFile) {//Crea el archivo, inicialmente vacio
        try {
            await fs.promises.writeFile(`${nameFile}`, '[]');
            console.log(`Archivo ${nameFile} creado exitosamente`);
        }
        catch (e) {
            console.log('no se pudo crear el archivo');
        }
    }

    async save(object, nameFile) {//Agrega un objeto al array del archivo
        const data = await fs.promises.readFile(
            `${nameFile}`, 'utf-8'
        );
        const elements = JSON.parse(data);
        object.id = elements.length + 1;

        if (elements.some(e => e.id == object.id)) {
            object.id = elements[elements.length - 1].id + 1;//Reasigno id para que no se repita
        }

        switch (nameFile) {
            case 'carrito.txt': {
                object.products = [];
                elements.push(object, nameFile);
                break;
            }
            case 'productos.txt': {
                //Si ya se repite el producto, se actualiza stock y cantidad
                //! (No se va a repetir si todos los ids van a ser distintos)
                if (elements.some(e => e == object)) {
                    const product = elements.find(e => e.id == object.id)
                    product.stock += object.stock;
                    product.timeStamp = Date.now();
                }
                else{
                    object.timeStamp = Date.now();
                    elements.push(object, nameFile);
                }
                break;
            }
            default: break;
        }
        
        const elementString = JSON.stringify(elements);

        try {
            await fs.promises.writeFile(
                `${nameFile}`, `${elementString}`
            )
            console.log(`Elemento de ${nameFile} guardado exitosamente`);
        }
        catch (e) {
            console.log('No se pudo guardar al producto en el archivo');
        }

        return object.id;
    }

    async getById(id, nameFile) {//Devuelve un producto mostrandolo por consola
        const data = await fs.promises.readFile(
            `${nameFile}`, 'utf-8'
        );
        const productos = JSON.parse(data);


        const productoBuscado = productos.find((unProducto) => unProducto.id == id)
        if (productoBuscado) {
            console.log(productoBuscado);
            return productoBuscado;
        }
        else {
            const noEncontrado = "Elemento no encontrado"
            console.log(noEncontrado);
            return noEncontrado;
        }
    }

    async getAll(nameFile) {//Devuelve contenido el archivo mostrandolo por consola
        try {
            const data = await fs.promises.readFile(
                `${nameFile}`, 'utf-8'
            );
            const personas = JSON.parse(data);
            console.log(personas);
            return personas;
        }
        catch (e) {
            const noEncontrado = "No encontrado"
            console.log(noEncontrado);
            return noEncontrado;
        }
    }

    async deleteById(id, nameFile) {//Quita el producto del array en el archivo
        const data = await fs.promises.readFile(
            `${nameFile}`, 'utf-8'
        );
        const personas = JSON.parse(data);

        if (personas.some(unaPersona => unaPersona.id == id)) {
            const personasActualizadas = JSON.stringify(personas.filter(unaPersona => unaPersona.id != id))
            try {
                await fs.promises.writeFile(
                    `${nameFile}`, `${personasActualizadas}`
                )
                console.log(`Item de ${nameFile} borrado exitosamente`)
            }
            catch (e) {
                console.log('No se pudo borrar al producto')
            }
        }
        else {
            console.log('No se encuentra en el archivo')
        }

    }

    async deleteAll(nameFile) {//Vacia el array de productos en el archivo
        try {
            await fs.promises.writeFile(`${nameFile}`, '[]')
            console.log(`Contenido total de ${nameFile} borrado exitosamente`)
        }
        catch (e) {
            console.log('No se pudo borrar')
        }
    }
}



//-------------------------------------------TEST--------------------------------------------------------

//Productos de prueba
const notebook = {
    name: "Notebook",
    marca: "Lenovo",
    price: 25000
}
const televisor = {
    name: "Televisor",
    marca: "Samsung",
    price: 25000
}
const auriculares = {
    name: "Auriculares",
    marca: "Redragon",
    price: 25000
}


const contenedor = new Contenedor();

//Hay que usar las funciones una por una, ya que al ser asincronas no se van a ejecutar secuencialmente

//contenedor.createFile();
//contenedor.save(notebook);
//contenedor.save(televisor);
//contenedor.save(auriculares);
//contenedor.getById(1)
//contenedor.getAll();
//contenedor.deleteById(2);
//contenedor.getAll();
//contenedor.deleteAll();

module.exports = Contenedor;