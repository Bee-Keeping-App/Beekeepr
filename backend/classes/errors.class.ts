/* 
Template error that all inherit
*/
export abstract class DomainError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;

        // Fix the prototype chain for built-in classes
        Object.setPrototypeOf(this, new.target.prototype);
        
        // Maintain stack trace (standard in V8/Node)
        if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
        }
    }
}

export class WrongPasswordError extends DomainError {
    constructor(message = 'Invalid login') {
        super(message, 401);
    }
}

export class NullQueryError extends DomainError {
    constructor(message = 'Query returned none') {
        super(message, 404);
    }
}

export class UnauthenticatedUserError extends DomainError {
    constructor(message = 'User not authenticated') {
        super(message, 401);
    }
}

export class UnauthorizedUserError extends DomainError {
    constructor(message = 'User not authorized') {
        super(message, 403);
    }
}

export class MissingTokenError extends DomainError {
    constructor(message = 'Request missing token') {
        super(message, 400);
    }
}

export class ExpiredTokenError extends DomainError {
    constructor(message = 'Token expired') {
        super(message, 400);
    }
}

export class InvalidTokenError extends DomainError {
    constructor(message = 'Token invalid') {
        super(message, 400);
    }
}

export class DuplicateFieldError extends DomainError {
    constructor(message = 'Unqiue index was violated') {
        super(message, 409);
    }
}

export class FailedValidationError extends DomainError {
    constructor(message = 'Request did not pass validation') {
        super(message, 400);
    }
}