import Joi from 'joi';
import {
    validUsername,
    validPassword,
    validEmail,
    validPhone
} from './fields.js';

// validation for GET 1 account
export const findOne = () => {
    return Joi.object({
        id: Joi.required()
    });
};

// validation logic for account POST
export const create = () => {
    return Joi.object({
        email: validEmail.required(),
        password: validPassword.required(),
        phone: validPhone.optional()
    });
};

// validation logic for account PATCH
export const update = () => {
    return Joi.object({
        email: validEmail.optional(),
        password: validPassword.optional(),
        phone: validPhone.optional()
    });
};

// validation logic for account DELETE
export const deleteOne = () => {
    return Joi.object({
        username: validUsername.required(),
        password: validPassword.required()
    });
};