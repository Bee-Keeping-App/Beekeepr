import * as SessionManager from '../services/session.service.js';
import * as TokenManager from '../services/tokens.service.js';

import {
    MissingTokenError
} from '../classes/errors.class.js';

/* Since the auth middleware has only 1 purpose (validating tokens),
    All the exported logic resides in this anonymous function.
    
    It does the following:
    -> checks for auth tokens, and throws an error if they're not found
    -> validates the tokens with the TokenManager service (a wrapper for the jwt library)
    -> if successful, it parses the id associated with the token and creates a kv pair for that id on the request body (useful later)
    -> if failure, it catches the error and forwards it to the error-handling middleware 
*/

export default async (req, res, next) => {
    
    try {

        // 1. parse tokens (if missing ==> bad request error)
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) 
            throw new MissingTokenError('Request has no access token');
        
        const accessString = authHeader.split(" ")[1];
        const refreshString = req.cookies.refreshToken;
        
        if (!refreshString) 
            throw new MissingTokenError('Request has no refresh token');


        // 2. validate tokens (if invalid ==> unauthenticated user error)
        let payload;
        payload = TokenManager.validateAccessToken(accessString);
        payload = TokenManager.validateRefreshToken(refreshString);

        // 3. attach the id to the request body (useful for operations downstream)
        req.user = payload.owner.id; 
        next(); // next means the next process in the route is called

    } catch (error) {
        
        // Middlewares live in a different scope than the controllers,
        // so the error-catching system won't explicitly catch the errors
        // You have to catch and then call next to propagate to the error-handler
        next(error);
    }
};