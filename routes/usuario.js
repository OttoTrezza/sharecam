
var express = require('express');
var app = express();
var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');
// var SEED = require('../config/config').SEED;



var Usuario = require('../models/usuario');
//=====================================================================
//Obtener todos los usuarios
//=====================================================================
app.get('/', (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email sala img role google')
        .skip(desde)
        .limit(5)
        .exec(

            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: err
                    });
                }
                Usuario.countDocuments({}, (err, conteo) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error cargando usuarios',
                            errors: err
                        });
                    }
                    // console.log('consultado usuarios');
                    res.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        usuariotoken: req.usuario,
                        total: conteo
                    });
                });
            });

});


//=====================================================================
//Actualizar un  usuario
//=====================================================================
app.put('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_o_MismoUsuario], (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id' + id + 'no existe',
                errors: { message: 'no existe un usuario con ese ID' }
            });
        }
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;
        usuario.sala = body.sala;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }
            usuarioGuardado.password = ':)';
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado,
                usuariotoken: req.usuario
            });
        });
    });
});



//=====================================================================
//Crear un nuevo usuario
//=====================================================================
app.post('/', (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role,
        sala: body.sala
    });

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario
        });

    });

});

//=====================================================================
//Borrar un usuario por el ID
//=====================================================================

app.delete('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE], (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe usuario con ese id',
                errors: { message: 'no existe un usuario con ese ID' }
            });
        }
        usuarioBorrado.password = ':)';
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado,
            usuariotoken: req.usuario
        });

    });

});


module.exports = app;