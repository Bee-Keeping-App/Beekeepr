const Joi = require('joi');

/* note:
    I would consider moving these schemas out to a global config/constant folder
    so the frontend and backend can use the same ones.

    Currently the password and email schemas are being reused by the auth validator schemas
    as well.
*/

// 3-20 chars, alphanum + '.' and '-' allowed
const validUsername = Joi.string()
            .min(3)
            .max(20)
            .pattern(new RegExp(/^[a-zA-Z0-9-.]{3,20}$/));

// 8-30 chars, alphanumeric + special chars allowed
export const validPassword = Joi.string()
            .min(8)
            .max(30)
            .pattern(new RegExp(/^[a-zA-z0-9!@#$%^&*()?]{8,30}$/));

export const validEmail = Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } });

// phone regex borrowed from https://stackoverflow.com/questions/16699007/
const validPhone = Joi.string()
            .pattern(new RegExp(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/));

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