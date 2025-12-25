const Joi = require('joi');

// validation for GET 1 account
exports.findOne = () => {
    return Joi.object({
        id: Joi.required()
    });
};

// validation logic for account POST
exports.create = () => {
    return Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
        phone: Joi.number().optional()
    });
};

// validation logic for account PATCH
exports.update = () => {
    return Joi.object({
        email: Joi.string().optional(),
        password: Joi.string().optional(),
        phone: Joi.number().optional()
    });
};

// validation logic for account DELETE
exports.delete = () => {
    return Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });
};