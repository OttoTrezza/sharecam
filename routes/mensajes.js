var express = require('express');
var app = require('express')();
// var http = require('http').createServer(app);
// var httpServer = require('../classes/server');
var socketIO = require('socket.io');
// var socketIO = require('socket.io');
io = socketIO();
var Usuario = require('../models/usuario');
// const server = Server.default.instance;
// router.get()....

app.get('/', (req, res) => {

    // server = Server.default.instance;
    io.emit('connect', this.usuario);
    console.log('User connect');
    res.send('#101000');
    res.json({
        ok: true,

    });
    //console.log(payload);
    // res.status(200).json({
    //     ok: true,
    //     de: payload.de,
    //     mensaje: payload.mensaje
    // });
});


app.get('/mensajes', (req, res) => {

    res.status(200).json({
        ok: true,
        de: payload.de,
        mensaje: payload.mensaje
    });
});
app.post('/mensajes', (req, res) => {
    var cuerpo = req.body.cuerpo;
    var de = req.body.de;
    var payload = { cuerpo, de };
    // server = Server.default.instance;
    io.emit('mensaje-nuevo', payload);
    res.json({
        ok: true,
        cuerpo,
        de
    });
    console.log(payload);
    res.status(200).json({
        ok: true,
        de: payload.de,
        mensaje: payload.mensaje
    });
});
app.post('/:id', (req, res) => {
    const cuerpo = req.body.cuerpo;
    const de = req.body.de;
    const id = req.params.id;
    const payload = {
        de,
        cuerpo
    };
    // server = Server.default.instance;
    server.io.in(id).emit('mensaje-privado', payload);
    res.json({
        ok: true,
        cuerpo,
        de,
        id
    });
});
// Servicio para obtener todos los IDs de los usuarios
app.get('/usuarios', (req, res) => {
    // server = Server.default.instance;
    server.io.clients((err, clientes) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            clientes
        });
    });
});
// Obtener usuarios y sus nombres
app.get('/usuarios/detalle', (req, res) => {
    res.json({
        ok: true,
        clientes: socket.usuariosConectados.getLista()
    });
});

// exports.default = router;
module.exports = app;