const Joi = require('joi');

// validate read by id
exports.idParam = () => {
    const scheme = Joi.object({
        id: Joi.string().required()
    });
    return scheme;
};

// validation logic for account POST
exports.create = () => {
    const scheme = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().required(),
        phone: Joi.string().required(),
        password: Joi.number().required()
    });
    return scheme;
};

// validation logic for account PATCH
exports.update = () => {
    const scheme = Joi.object({
        username: Joi.string().optional(),
        email: Joi.string().optional(),
        phone: Joi.string().optional(),
        password: Joi.number().optional()
    });
    return scheme;
};

// validation logic for account DELETE
exports.delete = () => {
    const scheme = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });
    return scheme;
};