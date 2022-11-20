var express = require('express');


var mdAutenticacion = require('../middlewares/autenticacion');
var SEED = require('../config/config').SEED;

var app = express();
var httpServer = require('../classes/server');
var Medico = require('../models/medico');

// =====================================================================
// Obtener todos los medicos
// =====================================================================

app.get('/', (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})

    .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital', 'nombre')
        .exec(

            (err, medicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medicos',
                        errors: err
                    });
                }
                Medico.countDocuments({}, (err, conteo) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error contando medicos',
                            errors: err
                        });
                    }
                    res.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: conteo
                    });
                });
            });
});

// =====================================================================
// Crear un nuevo medico
// =====================================================================

// FUTURO:
// hay que poner campo "id" en vez de "usuario"...wrong!

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });
    // este ID debe ser el del usuario administrador
    medico.save((err, medicoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado,
            usuariotoken: req.usuario
        });

    });


});
//=====================================================================
//Obtener un  medico por ID
//=====================================================================
app.get('/:id', (req, res) => {
    var id = req.params.id;

    Medico.findById(id)
        .populate('usuario', 'nombre email img')
        .populate('hospital')
        .exec((err, medico) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar medico',
                    errors: err
                });
            }
            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El medico con el id' + id + 'no existe',
                    errors: { message: 'no existe un medico con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                medico: medico
            });
        });
});

//=====================================================================
//Actualizar un  medico
//=====================================================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;
    // var aid = req.usuario.id;
    // var medicoACT = body.medicoActualizar;
    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }
        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id' + id + 'no existe',
                errors: { message: 'no existe un medico con ese ID' }
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        // medico = medicoActualizado;

        medico.save((err, medicoActualizado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    error: err
                });
            }
            res.status(200).json({
                ok: true,
                medico: medicoActualizado,
                ususariotoken: req.usuario
            });
        });
    });

});

//=====================================================================
//Eliminar un medico
//=====================================================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoEliminado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar medico',
                errors: { mensaje: 'no existe un medico con ese ID' }
            });
        }
        if (!medicoEliminado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe medico con ese id',
                errors: { message: 'no existe un medico con ese ID' }
            });
        }
        res.status(200).json({
            ok: true,
            medico: medicoEliminado,
            usuariotoken: req.usuario
        });
    });
});


module.exports = app;