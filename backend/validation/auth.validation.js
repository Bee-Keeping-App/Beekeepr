const Joi = require('joi');

// checks for refresh token
exports.hasRefreshToken = () => {
    return Joi.object({
        refreshToken: Joi.string().required()
    });
};

// checks for login credentials
exports.login = () => {
    return Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });
};