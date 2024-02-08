//Imports
const express = require("express");
const { findAll, findOneById, create, update, destroy } = require("./database/data.manager.js");

//Variables de entorno
require("dotenv").config();

//Inicializacion
const server = express();

//Middleware
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

//Endpoints
//Obtener todos los productos
server.get('/productos', (req, res) => {
    findAll()
        .then((productos) => res.status(200).send(productos))
        .catch((error) => res.status(400).send(error.message));
});
//Obtener un producto especifico
server.get('/productos/:id', (req, res) => {
    const { id } = req.params;

    findOneById(Number(id))
        .then((producto) => res.status(200).send(producto))
        .catch((error) => res.status(400).send(error.message));
});
//Crear un producto
server.post('/productos', (req, res) => {
    const { nombre, marca, costo, material } = req.body;

    create({ nombre, marca, costo: Number(costo), material })
        .then((producto) => res.status(201).send(producto))
        .catch((error) => res.status(400).send(error.message));
});
//Actualzar un producto especifico
server.put('/productos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, marca, costo, material } = req.body;

    update({ id: Number(id), nombre, marca, costo: Number(costo), material })
        .then((producto) => res.status(200).send(producto))
        .catch((error) => res.status(400).send(error.message));
});
//Eliminar un producto especifico
server.delete('/productos/:id', (req, res) => {
    const { id } = req.params;

    destroy(Number(id))
        .then((producto) => res.status(200).send(producto))
        .catch((error) => res.status(400).send(error.message));
});

//Metodo Oyente de Peticiones
server.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
    console.log(`Ejecutandose en http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`);
});