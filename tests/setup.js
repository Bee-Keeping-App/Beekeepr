require('dotenv').config({ path: './.env' });
console.log('REFRESH_SECRET:', process.env.REFRESH_SECRET); // debug
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongo;

// runs once at the beginning of the test suite
beforeAll(async () => {

    // makes the server
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();

    await mongoose.connect(uri);
});

// runs after every test
beforeEach(async () => {
    
    // identifies collections and deletes their contents
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

// runs after tests
afterAll(async () => {

    // deletes db
    await mongoose.connection.dropDatabase();
    
    // closes server
    await mongoose.connection.close();
    await mongo.stop();
});