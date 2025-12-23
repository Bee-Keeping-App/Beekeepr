const {
    InvalidTokenError,
    ExpiredTokenError,
    MissingTokenError,
    WrongPasswordError,
    DuplicateFieldError,
    NullQueryError,
    UnauthorizedUserError,
    UnauthenticatedUserError

} = require('../classes/errors.class');

module.exports = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // log the error
    console.log('======================================ERROR======================================\n',
        err);
    console.log('===================================END OF ERROR==================================');

    switch (err.constructor) {

        case MissingTokenError:
            return res.status(400).json(err.message);

        case DuplicateFieldError:
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
    }

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