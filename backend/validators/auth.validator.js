const Joi = require('joi');
const {
    validPassword,
    validEmail
} = require('./fields');

// checks for refresh token
// TODO: check for valid refresh token format as well
exports.hasRefreshToken = () => {
    return Joi.object({
        refreshToken: Joi.string().required()
    });
};

// checks for login credentials
exports.login = () => {
    return Joi.object({
        email: validEmail.optional(),
        password: validPassword.required()
    });
};