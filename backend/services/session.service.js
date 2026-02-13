import * as Accounts from '../services/accounts.service.js';
import * as TokenManager from '../services/tokens.service.js';
import {
    InvalidTokenError
} from '../classes/errors.class.js';

export const refreshSession = async (refreshTokenString) => {

    // if validate throws ==> force login
    const owner = TokenManager.validateRefreshToken(refreshTokenString).owner;
    
    // check that user owns this refresh token
    const user = await Accounts.findOneById(owner.id);
    if (user.refreshId != owner.version)
        throw new InvalidTokenError('User does not own this refresh token');

    // generate new access token
    const accessToken = TokenManager.signAccessToken(owner);
    return { owner, accessToken };
};