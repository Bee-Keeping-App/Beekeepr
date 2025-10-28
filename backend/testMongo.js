require('dotenv').config();
const { MongoBongo } = require('./dbClient');

const bongo = MongoBongo(process.env.DB_CONN);


console.log(`Mongo is connected: ${bongo.isConnected()}`);