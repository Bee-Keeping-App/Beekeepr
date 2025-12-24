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

            console.log('Request Arguments:\n', allArgs);

            const { error } = schema.validate(allArgs, { 
                allowUnknown: true, // Will ignore keys not specified by the validator
                stripUnknown: false // will remove unknown keys from request (KEEP AS FALSE)
            });

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