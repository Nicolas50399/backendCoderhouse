const fs = require('fs');

class ContenedorArchivos {
    constructor(id, nameFile) {
        this.id = id;
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

    async updateFile(items, nameFile){
        try{
            await fs.promises.writeFile(`${nameFile}`, JSON.stringify(items));
            console.log(`Archivo ${nameFile} actualizado exitosamente`);
        }
        catch (e) {
            console.log('no se pudo actualizar el archivo');
        }
    }

    async save(object, nameFile) {//Agrega un objeto al array del archivo
        const data = await fs.promises.readFile(
            nameFile, 'utf-8'
        );
        const elements = JSON.parse(data);
        object.id = elements.length + 1;

        if (elements.some(e => e.id == object.id)) {
            object.id = elements[elements.length - 1].id + 1;//Reasigno id para que no se repita
        }

        switch (nameFile) {
            case 'carrito.txt': {
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
            return productoBuscado;
        }
        else {
            const noEncontrado = "Elemento no encontrado"
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

module.exports = ContenedorArchivos;