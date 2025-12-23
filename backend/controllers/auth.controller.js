const Auth = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');

exports.refreshToken = catchAsync(async (req, res, next) => {

    // get new access token
    const accessToken = await Auth.refreshToken(req.cookies.refreshToken);
    return res.status(200).json({ accessToken });
});

exports.register = catchAsync(async (req, res, next) => {
    
    // delegate to auth
    const { accessToken, refreshToken } = await Auth.handleSignup(req.body);

    // attach tokens
    res.cookie("refreshToken", refreshToken, { 'httpOnly': true, 'secure': (process.env.USE_PROD == 'true') });
    return res.status(201).json({ accessToken });
});


exports.login = catchAsync(async (req, res, next) => {

    // get tokens from Auth
    accessToken, refreshToken = await Auth.handleLogin(req.body);

    // attach tokens
    res.cookie("refreshToken", refreshToken, { 'httpOnly': true, 'secure': (process.env.USE_PROD == 'true') });
    return res.status(200).json({ accessToken });
});

exports.logout = catchAsync(async (req, res, next) => {
    
    // do logout using auth
    await Auth.handleLogout(req.user);

    // removes the refresh token from the request
    res.cookie('refreshToken', '', { httpOnly: true, secure: (process.env.USE_PROD == 'true'), maxAge: 0 });
    
    return res.status(200).send();
});