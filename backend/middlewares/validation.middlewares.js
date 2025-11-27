module.exports = (schema) => {
    return (req, res, next) => {
        
        // schema is imported from /validation
        const { error } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({
            error: error.details[0].message
            });
        }

        next();
    };
};