import * as TokenManager from '../services/tokens.service';
import * as SessionManager from '../services/session.service';
import * as Accounts from '../services/accounts.service';

import {
    WrongPasswordError,
    NullQueryError,
    ExpiredTokenError,
    UnauthenticatedUserError,
    InvalidTokenError
} from '../classes/errors.class';


export const refreshToken = async (refreshString) => {

    // validate the token
    var payload = TokenManager.validateRefreshToken(refreshString);

    // find the user and validate the token version
    const user = await Accounts.findOneById(payload.owner.id, true);

    console.log('Refresh Token version:', payload.version);
    console.log('DB Refresh version:', user.refreshId);
    console.log('user in db:\n', user);

    if (user.refreshId != payload.version)
        throw new InvalidTokenError('Refresh token is invalid');
    
    // update the access token version
    await user.updateOne({ $inc: { accessId: 1 } });
    payload.version = user.accessId;

    // return the new access token
    return TokenManager.signAccessToken(payload);
};

// you should definitely put some specs here
export const handleLogin = async (email, password) => {

    // find user
    let user;
    try {
        
        // attempt to find user by their email
        user = await Accounts.findOne({ email }, true);
        if (!user) throw new NullQueryError('Email not found');

        // attempt to validate password with hash
        if (!(await user.validatePassword(password)))
            throw new WrongPasswordError('Attempt did not match hash');

    } catch (error) {
        
        // convert these errors into an Unauthenticated User error
        if (error instanceof NullQueryError ||
            error instanceof WrongPasswordError)
            throw new UnauthenticatedUserError('Invalid login')
    }

    // generate tokens
    const accessToken = TokenManager.signAccessToken({
        id: user.id,
        version: user.accessId
    });
    const refreshToken = TokenManager.signRefreshToken({
        id: user.id,
        version: user.refreshId
    });

    // login state is internally synced
    // return the tokens for embedding
    return { accessToken, refreshToken };
};

// you should definitely put some specs here
export const handleLogout = async (id) => {

    // find user
    const user = await Accounts.findOneById(id);
    if (!user) throw new NullQueryError('User not found');
    
    // update token ids to invalidate tokens
    await user.updateOne({
        $inc: { accessId: 1, refreshId: 1 }
    });
};

export const handleSignup = async (info) => {

    const initialVersion = 1;

    // data has passed validation, now needs to pass db insert
    const user = await Accounts.insertOne({
        ...info,
        accessId: initialVersion,
        refreshId: initialVersion
    });
    if (!user) throw new NullQueryError('Failed account insert into DB');

    // now need to make tokens
    const accessToken = TokenManager.signAccessToken({
        owner: {
            id: user.id
        },
        version: initialVersion, // should be math.random
    });
    const refreshToken = TokenManager.signRefreshToken({
        owner: {
            id: user.id
        },
        version: initialVersion
    });

    // signup state is internally synced
    // return the tokens for embedding
    return { accessToken, refreshToken };
};

export const validateTokenOwnership = async (accessString, refreshString) => {


    /*
    * 1. validate access and refresh strings
    * 2. check that their user ids match
    * 3. check that their token versions match in db
    */


    let accessPayload, refreshPayload, accessToken;
    
    // try validating the access token, and auto-refresh if it throws ExpiredTokenError
    try {
        accessPayload = TokenManager.validateAccessToken(accessString);
    } catch (error) {
        if (error instanceof ExpiredTokenError)
            accessPayload, accessToken = await SessionManager.refreshSession(refreshString);
        else
            throw error;
    }

    // now try validating the refresh token
    // if this throws ExpiredTokenError then that tells auth to trigger login
    // SessionManager.refreshSession() also throws ExpiredTokenError if refresh is expired
    refreshPayload = TokenManager.validateRefreshToken(refreshString);

    // implies these tokens belong to different users
    if (refreshPayload.owner.id != accessPayload.owner.id)
        throw new UnauthenticatedUserError('User has mismatched tokens');


    // get the user associated with these tokens
    const user = await Accounts.findOneById(refreshOwner.owner.id);
    if (user.refreshId != refreshPayload.version
        || user.accessId != accessPayload.version) 
        throw new UnauthenticatedUserError('User has invalid tokens');
    
    return accessToken;
};