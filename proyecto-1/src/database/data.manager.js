const fs = require("fs");
const path = require("path");

const ruta = path.join(__dirname, "data.json");

function escribir(contenido) {
    return new Promise((resolve, reject) => {
        fs.writeFile(ruta, JSON.stringify(contenido, null, "\t"), "utf8", (error) => {
            if (error) reject(new Error("Error. No se pudo escribir"));

            resolve(true);
        });
    });
}

function leer() {
    return new Promise((resolve, reject) => {
        fs.readFile(ruta, "utf8", (error, contenido) => {
            if (error) reject(new Error("Error. No se pudo leer"));

            resolve(JSON.parse(contenido));
        });
    });
}

function generarId(productos) {
    let mayorId = 0;

    productos.forEach((producto) => {
        if (producto.id > mayorId) {
            mayorId = producto.id;
        }
    });

    return mayorId + 1;
}

async function findAll() {
    const productos = await leer();
    return productos;
}

async function findOneById(id) {
    if (!id) throw new Error("Error! Id es indefido!");

    const productos = await leer();
    const producto = productos.find((item) => item.id === id);

    if (!producto) throw new Error("Error! El Id pasado por parametro no existe para un producto del catalogo!");

    return producto;
}

async function create(producto) {
    if (!producto.nombre || !producto.marca || !producto.costo || !producto.material) throw new Error("Error! Datos incompletos!");

    const productos = await leer();
    const productoConId = { id: generarId(productos), ...producto };

    productos.push(productoConId);

    await escribir(productos);
    return productoConId;
}

async function update(producto) {
    if (!producto.id || !producto.nombre || !producto.marca || !producto.costo || !producto.material) throw new Error("Error! Datos incompletos!");

    const productos = await leer();
    const indice = productos.findIndex((item) => item.id === producto.id);

    if (indice === -1) throw new Error("Error! El Id pasado por parametro no existe para un producto del catalogo!");

    productos[indice] = producto;
    await escribir(productos);

    return producto;
}

async function destroy(id) {
    if (!id) throw new Error("Error! Id es indefido!");

    const productos = await leer();
    const producto = productos.find((item) => item.id === id);
    const indice = productos.findIndex((item) => item.id === id);

    if (indice === -1) throw new Error("Error! El Id pasado por parametro no existe para un producto del catalogo");

    productos.splice(indice, 1);
    await escribir(productos);

    return producto;
}

module.exports = { findAll, findOneById, create, update, destroy };