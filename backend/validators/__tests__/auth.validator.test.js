import { hasRefreshToken, login } from '../auth.validator.js';

function validates(schema, value) {
    return !schema.validate(value).error;
}

describe('Auth validators', () => {

    describe('hasRefreshToken', () => {
        test('accepts an object with a refresh token string', () => {
            expect(validates(hasRefreshToken(), { refreshToken: 'some.jwt.string' })).toBe(true);
        });

        test('rejects missing refresh token', () => {
            expect(validates(hasRefreshToken(), {})).toBe(false);
        });

        test('rejects non-string refresh token', () => {
            expect(validates(hasRefreshToken(), { refreshToken: 12345 })).toBe(false);
        });
    });

    describe('login', () => {
        test('accepts valid email and password', () => {
            expect(validates(login(), { email: 'user@gmail.com', password: 'qwertyuiop' })).toBe(true);
        });

        test('rejects missing email', () => {
            expect(validates(login(), { password: 'qwertyuiop' })).toBe(false);
        });

        test('rejects missing password', () => {
            expect(validates(login(), { email: 'user@gmail.com' })).toBe(false);
        });

        test('rejects invalid email format', () => {
            expect(validates(login(), { email: 'notanemail', password: 'qwertyuiop' })).toBe(false);
        });

        test('rejects too-short password', () => {
            expect(validates(login(), { email: 'user@gmail.com', password: 'short' })).toBe(false);
        });
    });
});
