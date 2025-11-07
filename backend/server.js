/* Load env */
import 'dotenv/config';

/* Import Packages */
import express from 'express';
import { MongoClient } from 'mongodb';
import argon2 from 'argon2';

/* Consts / Vars */
const server = express();
const CLIENT = new MongoClient(process.env.DB_CONN);
const PORT = 3000;
const Validator = {
    register: (req) => req.body.username && req.body.password,
    login: (req) => req.body.username && req.body.password
};

/* Middlewares */
server.use(express.json());

/* endpoint list */
/*
    /login: validates user credentials 

*/

server.post('/register', async (req, res) => {

    // validate request
    if (!Validator.register(req)) {
        return res.status(400).send('Request did not validate');
    }

    const username = req.body.username;
    const password = req.body.password;

    try {

        const users = CLIENT.db('test-database').collection('test-login');
        const result = await users.insertOne({
            'user': username,
            'pass': password,
            'hash': await argon2.hash(password)
        });

        if (result.insertedId) {
            return res.status(200).send('Successfully registered');
        } else {
            return res.status(500).send('Failed to register');
        }
    } catch(error) {
        return res.status(500).send('Failed to register');
    }
});

server.post('/login', async (req, res) => {

    // ensure the login request is correctly formatted
    if (!Validator.login(req)) {
        return res.status(400);
    }

    const username = req.body.username;
    const password = req.body.password;

    try {
        // Login is a client that gets a user from the database
        const users = CLIENT.db('test-database').collection('test-login');
        
        // catches user not in db
        const match = await users.findOne({ user: username });
        if (match == null) {
            return res.status(400).json({msg: 'username not in db'});
        }

        if (await argon2.verify(match.hash, password)) {
            return res.status(200).send('user did authenticated');
        } else {
            return res.status(403).send('user did not authenticate');
        }

    } catch(error) {
        return res.status(500).send('server-side error during login');
    }
});

server.listen(PORT, async () => {
    await CLIENT.connect();
    console.log(`Server live on port ${PORT}`);
});