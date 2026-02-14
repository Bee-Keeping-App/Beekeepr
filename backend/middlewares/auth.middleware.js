import * as SessionManager from '../services/session.service.js';
import * as TokenManager from '../services/tokens.service.js';

import {
    MissingTokenError
} from '../classes/errors.class.js';

export default async (req, res, next) => {
    
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