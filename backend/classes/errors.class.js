class DomainError extends Error {
    constructor(message) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NullQueryError extends DomainError {
    constructor(message = 'Query returned none') {
        super(message);
    }
}

export class UnauthorizedUserError extends DomainError {
    constructor(message = 'User not authorized') {
        super(message);
    }
}

export class DuplicateFieldError extends DomainError {
    constructor(message = 'Unique index was violated') {
        super(message);
    }
}

export class FailedValidationError extends DomainError {
    constructor(message = 'Request did not pass validation') {
        super(message);
    }
}
