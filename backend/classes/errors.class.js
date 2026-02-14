class DomainError extends Error {
    constructor(message) {
        
        super(message);
        Error.captureStackTrace(this, this.constructor);
    }
}

export class WrongPasswordError extends DomainError {
    constructor(message = 'Invalid login') {
        super(message);
    }
}

export class NullQueryError extends DomainError {
    constructor(message = 'Query returned none') {
        super(message);
    }
}

export class UnauthenticatedUserError extends DomainError {
    constructor(message = 'User not authenticated') {
        super(message);
    }
}

export class UnauthorizedUserError extends DomainError {
    constructor(message = 'User not authorized') {
        super(message);
    }
}

export class MissingTokenError extends DomainError {
    constructor(message = 'Request missing token') {
        super(message);
    }
}

export class ExpiredTokenError extends DomainError {
    constructor(message = 'Token expired') {
        super(message);
    }
}

export class InvalidTokenError extends DomainError {
    constructor(message = 'Token invalid') {
        super(message);
    }
}

export class DuplicateFieldError extends DomainError {
    constructor(message = 'Unqiue index was violated') {
        super(message);
    }
}

export class FailedValidationError extends DomainError {
    constructor(message = 'Request did not pass validation') {
        super(message);
    }
}