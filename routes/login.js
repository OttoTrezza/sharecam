var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

require("dotenv").config();

var app = express();
var Usuario = require('../models/usuario');



var mdAutenticacion = require('../middlewares/autenticacion');
// ==========================================
//  Autenticación De Google
// ==========================================
app.get('/renuevatoken', mdAutenticacion.verificaToken, (req, res) => {

    var token = jwt.sign({ usuario: req.usuario }, process.env.SEED, { expiresIn: 14400 }); // 4 horas


    res.status(200).json({
        ok: true,
        token: token
    });
});

// ==========================================
//  Autenticación De Google
// ==========================================


// ==========================================
//  Autenticación normal
// ==========================================
app.post('/', (req, res) => {
console.log('en login');
    var body = req.body;
    console.log('en login', body);
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        // Crear un token!!!
        usuarioDB.password = ':)';

        var token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, { expiresIn: 14400 }); // 4 horas

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id,
            sala: usuarioDB.sala,
            menu: obtenerMenu(usuarioDB.role)
        });

    });


});



function obtenerMenu(ROLE) {
    var menu = [{
            titulo: 'Principal',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Dashboard', url: '/dashboard' },
                { titulo: 'Chat', url: '/mensajes' },
                { titulo: 'Camera', url: '/camera' },
           
              ]
        },
        {
            titulo: 'Mantenimientos',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
               ]
        }
    ];

    if (ROLE === 'ADMIN_ROLE') {
        menu[1].submenu.unshift({ titulo: 'Usuarios', url: '/usuarios' });
        menu[1].submenu.unshift({ titulo: 'Salas', url: '/salas' });
        menu[1].submenu.unshift({ titulo: 'Dispositivos', url: '/dispositivos' });
    }
    console.log('obteniendo menu', ROLE, menu)
    return menu;
}

module.exports = app;