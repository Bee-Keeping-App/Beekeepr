const Joi = require('joi');

// validate read by id
exports.id = (req, res, next) => {
    const schema = Joi.object({
        id: Joi.string().required()
    });

    const { error } = schema.validate(req.params);
    if (error) return res.status(400).json({ error: error.message });

    next();
}

// validation logic for account POST
exports.create = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().required(),
        phone: Joi.string().required(),
        password: Joi.number().required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    next();
};

// validation logic for account PATCH
exports.update = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().optional(),
        email: Joi.string().optional(),
        phone: Joi.string().optional(),
        password: Joi.number().optional()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    next();
}

// validation logic for account DELETE
exports.delete = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    next();
}