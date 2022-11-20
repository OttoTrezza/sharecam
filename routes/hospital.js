var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');
// var SEED = require('../config/config').SEED;

var app = express();

var Hospital = require('../models/hospital');

// =====================================================================
// Obtener todos los hospitales
// =====================================================================
app.get('/', (req, res) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({}, ' nombre email img role')
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(

            (err, hospitales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando hospital',
                        errors: err
                    });
                }
                Hospital.countDocuments({}, (err, conteo) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error cargando hospital',
                            errors: err
                        });
                    }
                    res.status(200).json({
                        ok: true,
                        hospitales: hospitales,
                        total: conteo
                    });
                });
            });

});

// ==========================================
// Obtener Hospital por ID
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Hospital.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, hospital) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar hospital',
                    errors: err
                });
            }
            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El hospital con el id ' + id + 'no existe',
                    errors: { message: 'No existe un hospital con ese ID' }
                });
            }
            res.status(200).json({
                ok: true,
                hospital: hospital
            });
        });
});

//=====================================================================
// Crear un nuevo Hospital
//=====================================================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado,
            // usuariotoken: req.usuario
        });

    });

});
//=====================================================================
//Actualizar un  hospital //, mdAutenticacion.verificaToken
//=====================================================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id; // ID del hospital a actualizar
    var body = req.body;


    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id' + id + 'no existe',
                errors: { message: 'no existe un hospital con ese ID' }
            });
        }
        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }
            //  console.log('Todo bien');
            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado,
                // usuariotoken: req.usuario
            });
        });
    });
});

//=====================================================================
//Borrar un hospital con ID
//=====================================================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe hospital con ese id',
                errors: { message: 'no existe un hospital con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            mensaje: 'Hospital BORRADO',
            hospital: hospitalBorrado,

            // usuariotoken: req.usuario
        });

    });

});


module.exports = app;