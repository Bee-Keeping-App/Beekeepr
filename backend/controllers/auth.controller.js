const Auth = require('../services/auth.service');
const Accounts = require('../services/accounts.service');

exports.refreshToken = async (req, res, next) => {

    try {

        // verify refresh token, get new access token, and send it in json
        const refreshToken = req.cookies.refreshToken;
        const payload = Auth.validateRefreshToken(refreshToken);
        const accessToken = Auth.signAccessToken(payload);

        // verify user owns this refresh token
        const user = await Accounts.findOneById(payload);
        if (refreshToken != user.token) {
            
            // if user does not own this refresh token, revoke their tokens and serve forbidden
            await Accounts.revokeToken(user.id);
            
            return res.status(403).json({ error: 'User does not own this refresh token '});
        }
        
        // success path for token refreshing
        return res.status(200).json({ accessToken });


    } catch(error) {
        
        // catch-all for expired or invalid refresh token
        return res.status(403).json({ error: 'Invalid/Expired token' });
    }
};

exports.login = async (req, res, next) => {

    try {
        
        const { username, password } = req.body;

        // obfuscate if wrong username or wrong password
        const user = await Accounts.comparePasswords(username, password);
        if (!user) return res.status(401).json({ error: 'Failed login' });

        // make new tokens on login
        const refreshToken = Auth.signRefreshToken({ id: user.id });
        const accessToken = Auth.signAccessToken({ id: user.id });

        // update token in db
        await Accounts.updateToken(user.id, refreshToken);

        // attach tokens
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: (process.env.USE_PROD == 'true') });
        
        return res.status(200).json({ accessToken });

    } catch(error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.logout = async (req, res, next) => {
    try {
        
        // revoke their token on logout
        await Accounts.revokeToken(req.user);
        
        // removes the refresh token from the request
        res.cookie('refreshToken', '', { httpOnly: true, secure: (process.env.USE_PROD == 'true'), maxAge: 0 });
        
        return res.status(204).send();
        
    } catch(error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};