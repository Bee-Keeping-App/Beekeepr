const Joi = require('joi');

// checks for refresh token
exports.hasRefreshToken = Joi.object({
    refreshToken: Joi.string().required()
});

// checks for login credentials
exports.login = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});