import Joi from 'joi';
import {
    validEmail,
    validPhone
} from './fields.js';

// validation for GET 1 account
export const findOne = () => {
    return Joi.object({
        id: Joi.required()
    });
};

// validation logic for account POST (no password, Clerk handles auth)
export const create = () => {
    return Joi.object({
        email: validEmail.required(),
        phone: validPhone.optional()
    });
};

// validation logic for account PUT
export const update = () => {
    return Joi.object({
        email: validEmail.optional(),
        phone: validPhone.optional()
    });
};
