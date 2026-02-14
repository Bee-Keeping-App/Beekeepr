import jwt from 'jsonwebtoken';
import {
    ExpiredTokenError,
    InvalidTokenError
} from '../classes/errors.class.js';

// constants from .env
const ACCESS_SECRET = process.env.ACCESS_SECRET;
const ACCESS_EXPIRY = '15m';
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const REFRESH_EXPIRY = '7d';

/* specs
 * Requires: ownerInfo contains user id and user role 
 * Modifies: None
 * Returns: JWT access token
 * Throws: None
*/

// template function
function signToken(payload, secret, expiry) {
    return jwt.sign({
        'owner': payload.owner,
        'iat': Math.floor(Date.now()),
        'version': payload.version
    },
    secret,
    { 
        expiresIn: expiry 
    });
};

// template function
function validateToken(tokenString, secret) {
    try {
        return jwt.verify(tokenString, secret);
    } catch (err) {

        // catches expired token error
        if (err.name === 'TokenExpiredError') {
            throw new ExpiredTokenError();
        }
        
        // catches other errors
        throw new InvalidTokenError();
    }
}

export const signAccessToken = (payload) => {
    return signToken(payload, ACCESS_SECRET, ACCESS_EXPIRY);
};

export const signRefreshToken = (payload) => {
    return signToken(payload, REFRESH_SECRET, REFRESH_EXPIRY);
};

export const validateAccessToken = (accessString) => {
    return validateToken(accessString, ACCESS_SECRET);
};

export const validateRefreshToken = (refreshString) => {
    return validateToken(refreshString, REFRESH_SECRET);
};