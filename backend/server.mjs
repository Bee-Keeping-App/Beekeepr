/* Load env */
import 'dotenv/config';

/* Import Packages */
import express from 'express';
import { MongoClient } from 'mongodb';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';


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
server.use(cookieParser());

/* Functions */
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_SECRET, { expiresIn: "15m" });
}

function generateRefreshToken(user) {
    return jwt.sign(user, process.env.REFRESH_SECRET, { expiresIn: "7d" });
}

function validateToken(token) {
    
    // checks for a token
    if (!token) {
        return {
            'isValid': false,
            'msg': 'token not present'
        };
    }

    try {
        const user = jwt.verify(token, process.env.ACCESS_SECRET);
        return {
            'isValid': true,
            'tok': user,
        };
    } catch(error) {
        return {
            'isValid': false,
            'msg': 'token did not verify'
        };
    }
    
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

        // connect and check for duplicate usernames
        const users = DbClient.db('test-database').collection('test-login');
        const conflictingUsername = await users.findOne({ user: username });
        if (conflictingUsername != null) {
            return res.status(400).send('Choose a different username');
        }

        // inserts
        const result = await users.insertOne({
            'user': username,
            'hash': await argon2.hash(password)
        });

        if (result.insertedId) {
            const refreshToken = generateRefreshToken({ username });
            const accessToken = generateAccessToken({ username });

            // adds refresh and access tokens and responds
            res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: false});
            return res.status(200).json({ accessToken });
        } else {
            return res.status(500).send('Failed to register');
        }
    } catch(error) {
        console.log(error);
        return res.status(500).send('Failed to register');
    }
});


server.post('/login', async (req, res) => {

    // ensure the login request is correctly formatted
    if (!Validator.login(req)) {
        return res.status(400).send('missing a parameter');
    }

    const username = req.body.username;
    const password = req.body.password;

    try {
        // Login is a client that gets a user from the database
        const users = DbClient.db('test-database').collection('test-login');

        // catches user not in db
        const match = await users.findOne({ user: username });
        if (match == null) {
            return res.status(400).json({msg: 'username not in db'});
        }

        if (await argon2.verify(match.hash, password)) {

            const refreshToken = generateRefreshToken({ username });
            const accessToken = generateAccessToken({ username });

            res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: false});
            return res.status(200).json({ accessToken });
        } else {
            return res.status(403).send('user did not authenticate');
        }

    } catch(error) {
        console.log(error);
        return res.status(500).send('server-side error during login');
    }
});


server.get('/refresh', async (req, res) => {
    
    const token = req.cookies?.refreshToken ?? null;
    if (!token) { return res.status(400).send('no refresh token'); }

    jwt.verify(token, process.env.REFRESH_SECRET, (err, user) => {
        
        // check if token is valid
        if (err) { return res.status(400).send('invalid refresh token'); }
        
        // generate fresh token, respond
        const accessToken = generateAccessToken({ username: user.username });
        return res.json({ accessToken });
    });

});


server.get('/almanac', async (req, res) => {
    
    // checks for a token
    const token = req.cookies?.accessToken ?? null;
    if (!token) { return res.status(400).send('no access token'); }

    // validates token
    var userId = null;
    try {
        const user = jwt.verify(token, process.env.ACCESS_SECRET);
        userId = user.userId;
    } catch(error) {
        return res.status(400).send('invalid refresh token');
    }
    
    // responds with data
    const getAllData = req.query.summary ? false : true;
    try {

        // gets user zip code
        const accounts = DbClient.db('test-database').collection('accounts');
        const userSettings = await accounts.findOne({ userId: userId });
        const location = userSettings.zip;
        
        // collect data via function call
        res.status(200).json({
            'weather': await weatherFunc(getAllData, location),
            'historical': await historicalFunc(getAllData, location)
        });
    }
    catch(error) {
        
    }

});


server.listen(PORT, async () => {
    await DbClient.connect();
    console.log(`Server live on port ${PORT}`);
});
