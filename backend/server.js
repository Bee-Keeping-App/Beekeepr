const { express } = require('express')

/* Port */
const port = 3000

/* Middlewares */
const server = express()

/* endpoint list */
/*
    /login: validates user credentials 

*/

server.post('/login', async (req, res) => {

    // ensure the login request is correctly formatted
    if (!Validator.login(req)) {
        return res.status(400);
    }

    const username = req.body.username;
    const password = req.body.password;

    try {
        // Login is a client that gets a user from the database
        const dbUser = await Login.getUser(username);
        
        // compares the salted + hashed attempt with the stored value
        if (dbUser.password == password) {
            return res.status(200);
        } else {
            return res.status(400).json({msg: 'passwords do not match'});
        }

    // Login throws an error if username not in database
    } catch(error) {
        return res.status(400).json({msg: 'username not in db'});
    }

});