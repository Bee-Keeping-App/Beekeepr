import {
    NullQueryError,
    UnauthorizedUserError,
    DuplicateFieldError,
    FailedValidationError
} from '../errors.class.js';

describe('Error classes', () => {

    test('all error classes extend Error', () => {
        const errors = [
            new NullQueryError(),
            new UnauthorizedUserError(),
            new DuplicateFieldError(),
            new FailedValidationError()
        ];

        for (const err of errors) {
            expect(err).toBeInstanceOf(Error);
        }
    });

    test('each class has the correct default message', () => {
        expect(new NullQueryError().message).toBe('Query returned none');
        expect(new UnauthorizedUserError().message).toBe('User not authorized');
        expect(new DuplicateFieldError().message).toBe('Unique index was violated');
        expect(new FailedValidationError().message).toBe('Request did not pass validation');
    });

    test('each class accepts a custom message', () => {
        expect(new NullQueryError('custom').message).toBe('custom');
        expect(new UnauthorizedUserError('custom').message).toBe('custom');
        expect(new DuplicateFieldError('custom').message).toBe('custom');
        expect(new FailedValidationError('custom').message).toBe('custom');
    });

    test('each error has a captured stack trace', () => {
        const errors = [
            new NullQueryError(),
            new UnauthorizedUserError(),
            new DuplicateFieldError(),
            new FailedValidationError()
        ];

        for (const err of errors) {
            expect(err.stack).toBeDefined();
            expect(err.stack).toContain('errors.test.js');
        }
    });
});
