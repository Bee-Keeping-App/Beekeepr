/* Load env */
import 'dotenv/config';

/* Import Packages */
import express from 'express';
import { MongoClient } from 'mongodb';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';


/* Consts and Vars */
const server = express();
const DB_CLIENT = new MongoClient(process.env.DB_CONN);
const DATABASE = process.env.IN_PROD ? process.env.PROD_DB : 'test-database'
const PORT = process.env.IN_PROD ? process.env.PROD_URL : 3000;
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
    /login:             gives user credentials upon successful login
    /register:          adds user to the database, gives credentials
    /refresh:           re-validates credentials until refresh token expires (forces login on expiry)
    /almanac:           returns with data for various APIs
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
        const users = DB_CLIENT.db(DATABASE).collection('users');
        const conflictingUsername = await users.findOne({ user: username });
        if (conflictingUsername != null) {
            return res.status(400).send('Choose a different username');
        }

        // adds user to the database
        const result = await users.insertOne({
            'user': username,
            'hash': await argon2.hash(password)
        });

        if (result.insertedId) {
            
            // grant access tokens
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
        const users = DB_CLIENT.db(DATABASE).collection('users');

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
    const { isValid, res } = validateToken(req.cookies?.accessToken ?? null);
    if (!isValid) {
        return res.status(400).json({msg: res});
    }
    
    // responds with data
    var userId = res.id;
    const getSummary = req.query.summary ? true : false;
    try {

        // gets user zip code
        const users = DB_CLIENT.db(DATABASE).collection('users');
        const userSettings = await users.findOne({ userId: userId });
        const location = userSettings.zip;
        
        // collect data via function call
        return res.status(200).json({

            // Complexity: numAPIs x numCalls, too much
            // Optimization: use a redis cache mapping request zip code to region data
            'weather': await weatherFunc(getSummary, location),
            'historical': await historicalFunc(getSummary, location)
        });
    }
    catch(error) {
        return res.status(500).json({'error': 'internal server error'});
    }

});


server.listen(PORT, async () => {
    await DB_CLIENT.connect();
    console.log(`Server live on port ${PORT}`);
});
