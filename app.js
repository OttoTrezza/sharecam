var mongoose = require('mongoose');
require('dotenv').config();
const { dbConnection } = require('./database/config');
var bodyParser = require('body-parser');
var Server = require('./classes/server');
var cors = require('cors');
// const path = require('path');
// const publicPath = path.resolve(__dirname, '../public');
//Importar rutas

var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var imagenesRoutes = require('./routes/imagenes');
var mensajesRoutes = require('./routes/mensajes');


//inicializar variables

var server = Server.default.instance;
//Body Parser ----MIDLEWARE
// parse application/x-www-form-urlencoded
server.app.use(bodyParser.urlencoded({ extended: false }));
server.app.use(bodyParser.json());

// Base de datos
dbConnection();


// CORS
// CORS
// app.use(express.static(path.resolve(__dirname, '../public')));
server.app.use(cors({ origin: true, credentials: true }));
// server.app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
//     next();
// });

// socket
// BodyParser
// server.app.use(bodyParser.urlencoded({ extended: true }));
// server.app.use(bodyParser.json());


// Rutas
//middlewear
server.app.use('/api/medico', medicoRoutes);
server.app.use('/api/hospital', hospitalRoutes);
server.app.use('/api/usuario', usuarioRoutes);
server.app.use('/api/login', loginRoutes);
server.app.use('/api/img', imagenesRoutes);
server.app.use('/api/mensajes', mensajesRoutes);
// server.app.use('/api/', tosocketRoutes);


// //Coneccion a la base de datos
// mongoose.set('useCreateIndex', true);
// // mongodb+srv://Marsupion:<password>@cluster0-9xz8q.mongodb.net/test?retryWrites=true&w=majority
// mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {
//     if (err) throw err;
//     console.log('Base de datos:\x1b[32m%s\x1b[0m', 'online');
// });
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// //// ESTO ES PARA VER LA CARPETA UPLOADS DEL FILESYSTEM DIRECTAMENTE EN EL NAVEGADOR SOLO CON: HTTP:LOCALHOST3000/UPLOADS/
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Server index config
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'));
// app.use('/uploads', serveIndex(__dirname + '/uploads'));


server.start(() => { // Me quedo escuchando el puerto 80!
    console.log(`Servidor corriendo en el puerto ${ process.env.PORT }`);
    console.log(`Escuchando puerto: ${ process.env.PORT }.`);
});
// app.listen(3000, () => {
//     console.log('Express server,Puerto 3000:\x1b[32m%s\x1b[0m', 'online');
// });