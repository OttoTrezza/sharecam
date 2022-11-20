var express = require('express');

// importa el metodo para subir archivo al servidor
var fileUpload = require('express-fileupload');

// importa el fileSystem
var fs = require('fs');

var app = express();

// Importa las colecciones
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

// middleware
app.use(fileUpload());

app.put('/:tipo/:id', (req, res) => {

    var tipo = req.params.tipo;
    var id = req.params.id;


    //tipos de coleccion
    var tiposValidos = ['hospitales', 'medicos', 'usuarios', 'mensajes'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono un tipo de coleccion valida',
            error: { mensaje: 'Debe seleccionar una coleccion de estas: ' + tiposValidos }
        });
    }


    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono ningun archivo',
            error: { mensaje: 'Debe seleccionar una imagen' }
        });
    }



    ////////////////////////////////
    // Obtener el nombre del archivo
    ////////////////////////////////

    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];



    ////////////////////////////////
    // Solo estas extensiones son validas
    ////////////////////////////////

    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No es un tipo de archivo valido',
            error: { mensaje: 'Debe seleccionar archivo de imagen, que sea: ' + extensionesValidas.join(', ') },
            extensionERR: { mensaje: 'La extension de su archivo es: ' + extensionArchivo }
        });
    }



    ////////////////////////////////
    // Nombre de archivo personalizado
    ////////////////////////////////

    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;



    ////////////////////////////////
    // Mover el archivo de un temporal a un path
    ////////////////////////////////

    var path = `./uploads/${tipo}/${nombreArchivo}`;
    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo al path',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

    });

});



function subirPorTipo(tipo, id, nombreArchivo, res) {


    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {
            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'No existe usuario con ese id',
                    errors: { message: 'No existe usuario para el id enviado por url' }
                });
            }
            // var pathViejo = './uploads/usuarios/' + usuario.img;

            // // Si existe, elimina la imagen anterior
            // if (fs.existsSync(pathViejo)) {
            //     fs.unlink(pathViejo);
            // }

            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                usuarioActualizado.password = ':)';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });
            });
        });


    }

    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {
            if (!medico) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'No existe medico con ese id',
                    errors: { message: 'No existe medico para el id enviado por url' }
                });
            }
            // var pathViejo = './uploads/medicos/' + medico.img;

            // // Si existe, elimina la imagen anterior
            // if (fs.existsSync(pathViejo)) {
            //     fs.unlink(pathViejo);
            // }

            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada',
                    medico: medicoActualizado
                });
            });
        });
    }

    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {
            if (!hospital) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'No existe hospital con ese id',
                    errors: { message: 'No existe hospital para el id enviado por url' }
                });
            }
            // var pathViejo = './uploads/hospitales/' + hospital.img;

            // // Si existe, elimina la imagen anterior
            // if (fs.existsSync(pathViejo)) {
            //     fs.unlink(pathViejo);
            // }

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    hospital: hospitalActualizado
                });
            });
        });
    }

    if (tipo === 'mensajes') {
        console.log(nombreArchivo);
    }

}


module.exports = app;