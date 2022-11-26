
var express = require('express');
require("dotenv").config();
var socketIO = require('socket.io');
var http = require('http');
const socket = require('../sockets/socket');
class Server {

    constructor() {
        console.log(process.env.PORT);
        this.app = express();
        // this.app.use('', express.static('public/'));
        this.port = process.env.PORT;
        this.httpServer = new http.Server(this.app);
        this.io = socketIO(this.httpServer);
        this.escucharSockets();
    }
    static get instance() {
        return this._instance || (this._instance = new this());
    }

    escucharSockets() {
        console.log('Escuchando conexiones - sockets');
        this.io.on('connection', cliente => {

            console.log('Cliente conectado', cliente.id);
            socket.conectar(cliente);
            socket.desconectar(cliente);
            socket.entrarChat(cliente);
            socket.mensaje(cliente);
            socket.mensajeAutoOTTO(cliente);
            socket.ElSarmiento(cliente);
            socket.configurarUsuario(cliente);
            socket.obtenerUsuarios(cliente);
            socket.obtenerSalas(cliente);
            socket.obtenerSalasActivas(cliente);
            socket.mousePos(cliente);
        });
    }
    start(callback) {
        this.httpServer.listen(this.port, callback);
        console.log('server.js start', this.port);
    }
}
exports.default = Server;