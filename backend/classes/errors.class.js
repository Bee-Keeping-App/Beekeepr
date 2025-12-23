class DomainError extends Error {
    constructor(message) {
        
        super(message);
        Error.captureStackTrace(this, this.constructor);
    }
}

class WrongPasswordError extends DomainError {
    constructor(message = 'Invalid login') {
        super(message);
    }
}

class NullQueryError extends DomainError {
    constructor(message = 'Query returned none') {
        super(message);
    }
}

class UnauthenticatedUserError extends DomainError {
    constructor(message = 'User not authenticated') {
        super(message);
    }
}

class UnauthorizedUserError extends DomainError {
    constructor(message = 'User not authorized') {
        super(message);
    }
}

class MissingTokenError extends DomainError {
    constructor(message = 'Request missing token') {
        super(message);
    }
}

class ExpiredTokenError extends DomainError {
    constructor(message = 'Token expired') {
        super(message);
    }
}

class InvalidTokenError extends DomainError {
    constructor(message = 'Token invalid') {
        super(message);
    }
}

class DuplicateFieldError extends DomainError {
    constructor(message = 'Unqiue index was violated') {
        super(message);
    }
}

module.exports = {
    WrongPasswordError,
    NullQueryError,
    DuplicateFieldError,
    UnauthenticatedUserError,
    UnauthorizedUserError,
    MissingTokenError,
    ExpiredTokenError,
    InvalidTokenError
};