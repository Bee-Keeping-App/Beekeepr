import Joi from 'joi';
import {
    validUsername,
    validPassword,
    validEmail,
    validPhone
} from './fields';

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
        password: validPassword.required(),
        phone: validPhone.optional()
    });
};

// validation logic for account PATCH
exports.update = () => {
    return Joi.object({
        email: validEmail.optional(),
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