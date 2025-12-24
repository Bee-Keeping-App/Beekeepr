const {
    FailedValidationError
} = require('../classes/errors.class');

module.exports = (schema) => {
    return (req, res, next) => {
        

        try {
            // schema is imported from /validation
            const allArgs = {
                ...req.body,
                ...req.params,
                ...req.query,
                ...req.cookies
            };
            const { error } = schema.validate(allArgs);

            // throw a validation error if validation failed
            if (error)
                throw new FailedValidationError();
            
            // no error ==> go to next function
            next();
        } catch (error) {
            
            // propagate error to the error handler middleware
            next(error);
        }
    };
};