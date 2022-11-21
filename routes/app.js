var express = require('express');
var app = express();

app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'peticion realizada correctamente.Agregue  /public  al URL'
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});
// app.post('/mensajes', (req, res) => {
//     var cuerpo = req.body.cuerpo;
//     var de = req.body.de;
//     var payload = { cuerpo, de };    
//     server = server.default.instance;
//     server.io.emit('mensaje-nuevo', payload);
//     res.json({
//         ok: true,
//         cuerpo,
//         de
//     });
//     console.log(payload);
// });
// app.post('/mensajes/:id', (req, res) => {
//     const cuerpo = req.body.cuerpo;
//     const de = req.body.de;
//     const id = req.params.id;
//     const payload = {
//         de,
//         cuerpo
//     };
//     // server = server;
//     server.io.in(id).emit('mensaje-privado', payload);
//     res.json({
//         ok: true,
//         cuerpo,
//         de,
//         id
//     });
// });
// // Servicio para obtener todos los IDs de los usuarios
// app.get('/usuarios', (req, res) => {
//     // const server = server;
//     server.io.clients((err, clientes) => {
//         if (err) {
//             return res.json({
//                 ok: false,
//                 err
//             });
//         }
//         res.json({
//             ok: true,
//             clientes
//         });
//     });
// });
// // Obtener usuarios y sus nombres
// app.get('/usuarios/detalle', (req, res) => {
//     res.json({
//         ok: true,
//         clientes: socket.usuariosConectados.getLista()
//     });
// });
module.exports = app;