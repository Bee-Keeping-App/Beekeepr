import Joi from 'joi';
import {
    validPassword,
    validEmail
} from './fields';

// checks for refresh token
// TODO: check for valid refresh token format as well
export const hasRefreshToken = () => {
    return Joi.object({
        refreshToken: Joi.string().required()
    });
};

// checks for login credentials
export const login = () => {
    return Joi.object({
        email: validEmail.required(),
        password: validPassword.required()
    });
};