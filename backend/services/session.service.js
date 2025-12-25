const Accounts = require('../services/accounts.service');
const TokenManager = require('../services/tokens.service');
const {
    InvalidTokenError
} = require('../classes/errors.class');

exports.refreshSession = async (refreshTokenString) => {

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