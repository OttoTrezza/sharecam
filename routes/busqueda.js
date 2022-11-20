var express = require('express');
var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    var promesa;
    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;
            // case 'salas':
            //     promesa = buscarSalas(regex);
            //     break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Las busqeudas posibles son: medicos, usuarios u hospitales',
                error: { message: 'Tipo de tabla/coleccion no valido' }
            });
    }


    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });

    });
});





app.get('/todo/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuarios(busqueda, regex)
            // buscarSalas(regex)
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
                    // salas: respuestas[3]
            });

        });



});


function buscarHospitales(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({}, 'nombre img id')
            .or([{ 'nombre': regex }, { 'id': regex }, { 'img': regex }])
            .populate('usuario', 'nombre email img')
            // .populate('hospital', ' img')
            .exec((err, hospitales) => {
                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }

            });
    });

}

function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            // .populate('hospital', ' img')
            // .populate('medico', ' img')
            .exec((err, medicos) => {
                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicos);
                }

            });
    });

}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role sala img')
            .or([{ 'nombre': regex }, { 'email': regex }, { 'role': regex }, { 'sala': regex }])
            .populate('usuario', ' img')
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar el usuario', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}

// function buscarSalas(regex) {

//     return new Promise((resolve, reject) => {
//         Usuario.find({}, 'sala')
//             .populate('sala')
//             .exec((err, salas) => {
//                 if (err) {
//                     reject('Error cargando salas');
//                 } else {
//                     resolve(salas);
//                 }
//                 Usuario.countDocuments({}, (err, conteo) => {
//                     if (err) {
//                         console.log('Error cargando salas - conteo');
//                     }
//                     this.usuariosConectados.agregarSalas(salas);
//                     console.log('salasbusqueda', salas, conteo);
//                 });
//             });
//     });
// }
module.exports = app;