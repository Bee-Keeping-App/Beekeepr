module.exports = (schema) => {
    return (req, res, next) => {
        
        // schema is imported from /validation
        const allArgs = {
            ...req.body,
            ...req.params,
            ...req.query,
            ...req.cookies
        };
        const { error } = schema.validate(allArgs);

        if (error) {
            return res.status(400).json({
                error: error.details[0].message
            });
        }

        next();
    };
};