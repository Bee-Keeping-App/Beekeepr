import {
    FailedValidationError
} from '../classes/errors.class.js';

/* I didn't do validation well, so let's go over how it works here

    There is the validation middleware and the validator files.

    The validator files contain schemas requests need to follow.
    This ensures a request has all the necessary info for the backend to process it,
    and is a useful way to catch malformed requests fast.

    Defining the schema is simple, but implementing it means passing the request as an argument
    into the schema object. This is the role of the middleware.

    See how it takes a schema arg? You call this middleware in a route before the controller, and 
    pass the schema for that endpoint as the argument. It has scope over the request because its in 
    the router function, and can see the schema you passed to it

    The rest is simple. Aggregate the request parameters, see if everything is there, then handle.
*/

export default (schema) => { // schema is the joi validator passed in the route file
    return (req, res, next) => {
        try {   // note the try/catch statement, as middlewares are outside of the controller scope 

            // collect all the places arguments are passed in a request into one json
            const allArgs = {
                ...req.body,
                ...req.params,
                ...req.query,
                ...req.cookies
            };
            
            // pass that json into the validator, ensure no error
            const { error } = schema.validate(allArgs, { 
                allowUnknown: true, // Will ignore keys not specified by the validator
                stripUnknown: false // will remove unknown keys from request (KEEP AS FALSE)
            });

            // throw a validation error if validation failed
            // this will be immediately caught by the catch statement
            if (error)
                throw new FailedValidationError();
            
            // no error ==> go to next function with next()
            next();
        } catch (error) {
            
            // propagate error to the error handler middleware
            next(error);
        }
    };
};