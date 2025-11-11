/* Load env */
import 'dotenv/config';

/* Import Packages */
import express from 'express';
import { MongoClient } from 'mongodb';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

/* Consts / Vars */
const server = express();
const DbClient = new MongoClient(process.env.DB_CONN);
const PORT = 3000;
const Validator = {
    register: (req) => req.body.username && req.body.password,
    login: (req) => req.body.username && req.body.password
};

/* Middlewares */
server.use(express.json());

/* Functions */
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_SECRET, { expiresIn: "15m" });
}

function generateRefreshToken(user) {
    return jwt.sign(user, process.env.REFRESH_SECRET, { expiresIn: "7d" });
}
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

        const users = DbClient.db('test-database').collection('test-login');
        const result = await users.insertOne({
            'user': username,
            'pass': password,
            'hash': await argon2.hash(password)
        });

        if (result.insertedId) {
            const refreshToken = generateRefreshToken({ result });
            const accessToken = generateAccessToken({ result });

            res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: false});
            return res.status(200).json({ accessToken }).send('Successfully registered');
        } else {
            return res.status(500).send('Failed to register');
        }
    } catch(error) {
        return res.status(500).send('Failed to register');
    }
});

server.post('/login', async (req, res) => {

    // ensure the login request is correctly formatted
    /*if (!Validator.login(req)) {
        return res.status(400);
    } */

    const username = req.body.username;
    const password = req.body.password;

    try {
        // Login is a client that gets a user from the database
        const users = DbClient.db('test-database').collection('test-login');
        console.log('found table');
        // catches user not in db
        const match = await users.findOne({ user: username });
        if (match == null) {
            console.log('username not in db');
            return res.status(400).json({msg: 'username not in db'});
        }

        console.log('found match');
        if (await argon2.verify(match.hash, password)) {
            console.log('passwords match');
            const refreshToken = generateRefreshToken({ match });
            const accessToken = generateAccessToken({ match });

            res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: false});
            return res.status(200).json({ accessToken });
        } else {
            console.log('password was incorrect');
            return res.status(403).send('user did not authenticate');
        }

    } catch(error) {
        console.log(error);
        return res.status(500).send('server-side error during login');
    }
});

server.get('/refresh', async (req, res) => {
    const token = req.cookies.refreshToken;
    
    if (!token) { return res.status(400).send('no refresh token'); }

    jwt.verify(token, process.env.REFRESH_SECRET, (err, user) => {
        
        if (err) { return res.status(400).send('invalid refresh token'); }
        
        const accessToken = generateAccessToken(user);
        return res.json({ accessToken });
    });

});

server.listen(PORT, async () => {
    await DbClient.connect();
    console.log(`Server live on port ${PORT}`);
});
