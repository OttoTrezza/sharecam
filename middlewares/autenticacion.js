var jwt = require('jsonwebtoken');
require('../config/config');
// var SEED = process.env.SEED;


// ==========================================
//  Verificar token
// ==========================================
exports.verificaToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();


    });

};
// ==========================================
//  Verificar ADMIN
// ==========================================
exports.verificaADMIN_ROLE = function(req, res, next) {

    var usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto - No es administrador',
            errors: { message: 'Mo es administrador, no puede hacer' }
        });
    }
};
// ==========================================
//  Verificar ADMIN o Mismo Usuario
// ==========================================
exports.verificaADMIN_o_MismoUsuario = function(req, res, next) {

    var usuario = req.usuario;
    var id = req.params.id;
    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto - No es administrador - ni es el mismo usuario',
            errors: { message: 'Mo es administrador, no puede hacer' }
        });
    }
};