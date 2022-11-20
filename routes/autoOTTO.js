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
    console.log('User connect', this.usuario);
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


// exports.default = router;
module.exports = app;