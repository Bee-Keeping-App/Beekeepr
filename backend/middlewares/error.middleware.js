import {
    FailedValidationError,
    InvalidTokenError,
    ExpiredTokenError,
    MissingTokenError,
    WrongPasswordError,
    DuplicateFieldError,
    NullQueryError,
    UnauthorizedUserError,
    UnauthenticatedUserError

} from '../classes/errors.class.js';

export default (err, req, res, next) => { // eslint-disable-line no-unused-vars

    // ensures responses have basic info attached
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // log the error
    console.log(`======================================ERROR======================================\n\n
        %O\n\n
        ===================================END OF ERROR==================================`, err
    );

    /* This massive switch statement might look like shit
        Mostly bc it is. If someone has a better idea for it shoot. 

        The object was to map an error state to a response pattern.
        A better way to do this would be to modify the error inheritance pattern
        and add a way to generate the fields for a response from the error

        Ex: each error would have a toResponse function that could be attached to the
        response object and would negate any need to to a massive switch statement
    */
    
    switch (err.constructor) {

        case FailedValidationError:
            return res.status(400).json(err.message);
        
        case MissingTokenError:
            return res.status(400).json(err.message);

        case InvalidTokenError:
            return res.status(401).json(err.message);

        case ExpiredTokenError:
            return res.status(401).json(err.message);
        
        case WrongPasswordError:
            return res.status(401).json(err.message);

        case UnauthenticatedUserError:
            return res.status(401).json(err.message);
        
        case UnauthorizedUserError:
            return res.status(403).json(err.message);

        case NullQueryError:
            return res.status(404).json(err.message);

        case DuplicateFieldError:
            return res.status(409).json(err.message);
    }

    // this if statement controls how much info we send
    // In development, send everything to be helpful
    // In production, be more secretive
    if (process.env.USE_PROD == 'false') {
        // send a detailed response
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });

    } else {

        // send a minimal response
        res.status(500).json({
            status: 'error',
            message: 'An unexpected error occurred'
        });
    }
};