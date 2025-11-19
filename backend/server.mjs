/* Load env */
import 'dotenv/config';

/* Import Packages */
import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';


/* Consts and Vars */
const server = express();
const DB_CLIENT = new MongoClient(process.env.DB_CONN);
const DATABASE = (process.env.USE_PROD == 'true') ? process.env.PROD_DB : 'test-database'
const PORT = (process.env.USE_PROD == 'true') ? process.env.PROD_URL : 3000;
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

function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) return res.status(400).json({ msg: 'No access token.' });

    try {
        const payload = jwt.verify(token, process.env.ACCESS_SECRET);
        req.user = payload;
        next();
    } catch(error) {
        return res.status(500).json({ msg: 'Invalid or expired token.' });
    }
}

/* endpoint list */
/*
    /login:             gives user credentials upon successful login
    /register:          adds user to the database, gives credentials
    /account:           delete account, get account info
    /refresh:           re-validates credentials until refresh token expires (forces login on expiry)
    /almanac:           returns with data for various APIs
*/


// load account data
server.get('/account', authenticate, async (req, res) => {

    try {
        const userId = req.user.userId;
        const users = DB_CLIENT.db(DATABASE).collection('users');
        const user = await users.findOne({ _id: new ObjectId(`${userId}`) });
        
        if (!user) return res.status(400).json({ msg: 'user does not exist'});
        
        // TODO: Return a securely-partitioned version of this?
        return res.status(200).json(user);
    } catch(error) {
        return res.status(500).json({'msg': 'Internal Server Error'});
    }
});


// account deletion
server.delete('/account', authenticate, async (req, res) => {

    try {
        const userId = req.user.userId;
        const users = DB_CLIENT.db(DATABASE).collection('users');
        const result = await users.deleteOne({ _id: new ObjectId(`${userId}`) });
        
        // TODO: Return a securely-partitioned version of this?
        return res.status(200).json({'msg': 'Successful delete'});
    } catch(error) {
        console.log(error);
        return res.status(500).json({'msg': 'Internal Server Error'});
    }

});


// account registration, no auth here
server.post('/account', async (req, res) => {

    // validate request
    if (!Validator.register(req)) {
        return res.status(400).json({msg: 'Request did not validate'});
    }
    
    const username = req.body.username;
    const password = req.body.password;

    try {

        // connect and check for duplicate usernames
        const users = DB_CLIENT.db(DATABASE).collection('users');
        const conflictingUsername = await users.findOne({ user: username });
        if (conflictingUsername != null) {
            return res.status(400).json({msg: 'Choose a different username'});
        }

        // adds user to the database
        const result = await users.insertOne({
            'user': username,
            'hash': await argon2.hash(password)
        });

        if (result.insertedId) {
            
            // grant access tokens
            const refreshToken = generateRefreshToken({userId: result.insertedId.toString()});
            const accessToken = generateAccessToken({userId: result.insertedId.toString()});

            // adds refresh and access tokens and responds
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true, 
                secure: (process.env.USE_PROD == 'true') ? true : false,
                sameSite: 'strict' 
            });

            return res.status(200).json({ accessToken });
        } else {
            return res.status(500).json({msg: 'Failed to register'});
        }
    } catch(error) {
        console.log(error);
        return res.status(500).json({msg: 'Failed to register'});
    }
});


// validates login attempt. grants jwts, no auth here
server.post('/login', async (req, res) => {

    // ensure the login request is correctly formatted
    if (!Validator.login(req)) {
        return res.status(400).json({'msg': 'missing a parameter'});
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

            const refreshToken = generateRefreshToken({userId: match._id.toString()});
            const accessToken = generateAccessToken({userId: match._id.toString()});

            res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: false});
            return res.status(200).json({ accessToken });
        } else {
            return res.status(403).json({msg: 'user did not authenticate'});
        }

    } catch(error) {
        console.log(error);
        return res.status(500).json({msg: 'server-side error during login'});
    }
});


// refreshes access tokens
server.get('/refresh', authenticate, async (req, res) => {
    
    const accessToken = generateAccessToken({ userId: req.user.userId });
    return res.json({ accessToken });

});


// retrieves data from apis
server.get('/almanac', authenticate, async (req, res) => {
    
    try {

        // defines data scope
        var userId = req.user.userId;
        const getSummary = req.query.summary ? true : false;
        
        // gets user zip code
        const users = DB_CLIENT.db(DATABASE).collection('users');
        const userSettings = await users.findOne({ _id: new ObjectId(`${userId}`) });
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
