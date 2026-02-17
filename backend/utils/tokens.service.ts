import jwt from 'jsonwebtoken';

import {
    ExpiredTokenError,
    InvalidTokenError
} from '../classes/errors.class';

import { TokenPayload, TokenPayloadSchema } from './utils.schema.js';

// constants from .env
const ACCESS_SECRET: string = process.env.ACCESS_SECRET;
const ACCESS_EXPIRY: string = '15m';
const REFRESH_SECRET: string = process.env.REFRESH_SECRET;
const REFRESH_EXPIRY: string = '7d';

/* specs
 * Requires: ownerInfo contains user id and user role 
 * Modifies: None
 * Returns: JWT access token
 * Throws: None
*/

// template function
function signToken(payload: TokenPayload, secret: string, expiry: string) {
    return jwt.sign({
        'owner': payload.owner,
        'iat': Math.floor(Date.now()),
        'version': payload.version
    },
    secret,
    { 
        expiresIn: expiry as any
    });
};

// template function
function validateToken(tokenString: string, secret: string) {
    try {
        return jwt.verify(tokenString, secret);
    } catch (err: any) {

        // catches expired token error
        if (err.name === 'TokenExpiredError') {
            throw new ExpiredTokenError('This token has expired');
        }
        
        // catches other errors
        throw new InvalidTokenError('This token is not valid');
    }
}

// implements signToken for the access token
export const signAccessToken = (payload: TokenPayload) => {
    return signToken(payload, ACCESS_SECRET, ACCESS_EXPIRY);
};

// implements signToken for the refresh token
export const signRefreshToken = (payload: TokenPayload) => {
    return signToken(payload, REFRESH_SECRET, REFRESH_EXPIRY);
};

// implements validateToken for the access token
export const validateAccessToken = (accessString: string) => {
    return validateToken(accessString, ACCESS_SECRET);
};

// implements validateToken for the refresh token
export const validateRefreshToken = (refreshString: string) => {
    return validateToken(refreshString, REFRESH_SECRET);
};