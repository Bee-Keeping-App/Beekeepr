const Joi = require('joi');
const {
    validUsername,
    validPassword,
    validEmail,
    validPhone
} = require('./fields');

// validation for GET 1 account
exports.findOne = () => {
    return Joi.object({
        id: Joi.required()
    });
};

// validation logic for account POST
exports.create = () => {
    return Joi.object({
        email: validEmail.required(),
        username: validUsername.required(),
        password: validPassword.required(),
        phone: validPhone.optional()
    });
};

// validation logic for account PATCH
exports.update = () => {
    return Joi.object({
        email: validEmail.optional(),
        username: validUsername.optional(),
        password: validPassword.optional(),
        phone: validPhone.optional()
    });
};

// validation logic for account DELETE
exports.delete = () => {
    return Joi.object({
        username: validUsername.required(),
        password: validPassword.required()
    });
};