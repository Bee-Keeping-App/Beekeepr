import {
    WrongPasswordError,
    NullQueryError,
    UnauthenticatedUserError,
    UnauthorizedUserError,
    MissingTokenError,
    ExpiredTokenError,
    InvalidTokenError,
    DuplicateFieldError,
    FailedValidationError
} from '../errors.class.js';

describe('Error classes', () => {

    test('all error classes extend Error', () => {
        const errors = [
            new WrongPasswordError(),
            new NullQueryError(),
            new UnauthenticatedUserError(),
            new UnauthorizedUserError(),
            new MissingTokenError(),
            new ExpiredTokenError(),
            new InvalidTokenError(),
            new DuplicateFieldError(),
            new FailedValidationError()
        ];

        for (const err of errors) {
            expect(err).toBeInstanceOf(Error);
        }
    });

    test('each class has the correct default message', () => {
        expect(new WrongPasswordError().message).toBe('Invalid login');
        expect(new NullQueryError().message).toBe('Query returned none');
        expect(new UnauthenticatedUserError().message).toBe('User not authenticated');
        expect(new UnauthorizedUserError().message).toBe('User not authorized');
        expect(new MissingTokenError().message).toBe('Request missing token');
        expect(new ExpiredTokenError().message).toBe('Token expired');
        expect(new InvalidTokenError().message).toBe('Token invalid');
        expect(new DuplicateFieldError().message).toBe('Unqiue index was violated');
        expect(new FailedValidationError().message).toBe('Request did not pass validation');
    });

    test('each class accepts a custom message', () => {
        expect(new WrongPasswordError('custom').message).toBe('custom');
        expect(new NullQueryError('custom').message).toBe('custom');
        expect(new UnauthenticatedUserError('custom').message).toBe('custom');
        expect(new UnauthorizedUserError('custom').message).toBe('custom');
        expect(new MissingTokenError('custom').message).toBe('custom');
        expect(new ExpiredTokenError('custom').message).toBe('custom');
        expect(new InvalidTokenError('custom').message).toBe('custom');
        expect(new DuplicateFieldError('custom').message).toBe('custom');
        expect(new FailedValidationError('custom').message).toBe('custom');
    });

    test('each error has a captured stack trace', () => {
        const errors = [
            new WrongPasswordError(),
            new NullQueryError(),
            new MissingTokenError(),
            new InvalidTokenError(),
            new ExpiredTokenError(),
            new DuplicateFieldError(),
            new FailedValidationError()
        ];

        for (const err of errors) {
            expect(err.stack).toBeDefined();
            expect(err.stack).toContain('errors.test.js');
        }
    });
});
