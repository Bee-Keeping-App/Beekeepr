import { Request, Response, NextFunction } from 'express';

import * as SessionManager from '../utils/session.service.js';
import * as TokenManager from '../utils/tokens.service.js';

import { AuthObject, AuthParserSchema } from './middlewares.schema.js';
/* Since the auth middleware has only 1 purpose (validating tokens),
    All the exported logic resides in this anonymous function.
    
    It does the following:
    -> checks for auth tokens, and throws an error if they're not found
    -> validates the tokens with the TokenManager service (a wrapper for the jwt library)
    -> if successful, it parses the id associated with the token and creates a kv pair for that id on the request body (useful later)
    -> if failure, it catches the error and forwards it to the error-handling middleware 
*/

export default async (req: Request, res: Response, next: NextFunction) => {
    
    try {

        // parses the tokens from the auth object
        const { refreshString, accessString } = AuthParserSchema.parse(req);

        // if each succeed without error then both tokens are valid
        let payload;    // payload holds information about the token owner
        payload = TokenManager.validateAccessToken(refreshString);
        payload = TokenManager.validateRefreshToken(accessString);

        // 3. attach the id to the request body (useful for operations downstream)
        // TODO: Find a way to implement this in a TS-friendly manner
        // req.user = payload.owner.id;
        next(); // next means the next process in the route is called

    } catch (error) {
        
        // Middlewares live in a different scope than the controllers,
        // so the error-catching system won't explicitly catch the errors
        // You have to catch and then call next to propagate to the error-handler
        next(error);
    }
};