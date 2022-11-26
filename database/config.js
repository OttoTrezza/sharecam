require("dotenv").config();
const mongoose = require('mongoose');

const uri = process.env.URLDB

const dbConnection = async() => {
    try {
        await mongoose.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            })
            .then(x => {
                console.log(
                    `Connected to Mongo! Database name: "${x.connections[0].name}"`
                );
            })
            // console.log('DB Online');

    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la BD ver logs');
    }
    mongoose.set('useFindAndModify', false);
    mongoose.connection.on('errorDB', err => {
        logError(err);
    });
}

module.exports = {
    dbConnection
}