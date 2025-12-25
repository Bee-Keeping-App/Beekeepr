const SessionManager = require('../services/session.service');
const TokenManager = require('../services/tokens.service');

const {
    MissingTokenError
} = require('../classes/errors.class');

module.exports = async (req, res, next) => {
    
    try {

        // 1. parse tokens
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) 
            throw new MissingTokenError('Request has no access token');
        
        const accessString = authHeader.split(" ")[1];
        const refreshString = req.cookies.refreshToken;
        
        if (!refreshString) 
            throw new MissingTokenError('Request has no refresh token');

        // 2. validate tokens

        let payload;
        payload = TokenManager.validateAccessToken(accessString);
        payload = TokenManager.validateRefreshToken(refreshString);

        // 6. Finalize Request Identity
        req.user = payload.owner.id; 
        next();

    } catch (error) {
        // Since this is an async middleware, you MUST catch errors 
        // and pass them to next() so your Global Error Handler catches them.
        next(error);
    }
};