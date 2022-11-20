// ============================
// Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;


// ============================
// Entorno
// ============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================
// vENCIMIENTO DEL TOKEN
// ============================
// 60 segundos
// 60 minutos
// 24 horas 
// 30 dias
process.env.CADUCIDAD_TOKEN = '48h';
// ///
// SEED = 'este-es-un-seed-dificil';
// Google
GOOGLE_CLIENT_ID = '584414601747-ve69u1oukn9kq53u3den4hm8f986jcsc.apps.googleusercontent.com';
GOOGLE_SECRET = 'bTCYI-p9t-i8RrZcGc-ZAcue';

SERVER_PORT = 3000;
// ///heroku logs tail
// ============================
// SEED de autenticacion
// ============================
process.env.SEED = process.env.SEED || 'este_es_el_seed_desarrollo';

// ============================
// Base de datos
// ============================

let urlDB;
if (process.env.NODE_ENV === 'dev') {

    urlDB = //'mongodb://localhost:27017/test';
    'mongodb+srv://Marsupion:3noqHdazT3Qk94T9@cluster0-9xz8q.mongodb.net/test';

} else {
    //    mongodb+srv://Marsupion:<password>@cluster0-9xz8q.mongodb.net/test?retryWrites=true&w=majority
    // mongodb+srv://marsupion:<password>@cluster0-9xz8q.mongodb.net mongodb+srv://Mars
    // mongodb+srv://Marsupion:<password>@cluster0-9xz8q.mongodb.net/test?retryWrites=true&w=majority
    urlDB = 'mongodb+srv://Marsupion:3noqHdazT3Qk94T9@cluster0-9xz8q.mongodb.net/test';
}

process.env.URLDB = urlDB;

// ============================
// Google CLIENT_ID
// ============================

process.env.CLIENT_ID = process.env.CLIENT_ID || '584414601747-ve69u1oukn9kq53u3den4hm8f986jcsc.apps.googleusercontent.com';