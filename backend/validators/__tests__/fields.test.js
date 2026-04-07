import { validUsername, validPassword, validEmail, validPhone } from '../fields.js';

function validates(schema, value) {
    return !schema.validate(value).error;
}

describe('Field validators', () => {

    describe('validUsername', () => {
        test('accepts valid usernames', () => {
            expect(validates(validUsername, 'alice')).toBe(true);
            expect(validates(validUsername, 'bob-ross')).toBe(true);
            expect(validates(validUsername, 'user.name123')).toBe(true);
            expect(validates(validUsername, 'abc')).toBe(true); // min length
            expect(validates(validUsername, 'a'.repeat(20))).toBe(true); // max length
        });

        test('rejects too short', () => {
            expect(validates(validUsername, 'ab')).toBe(false);
        });

        test('rejects too long', () => {
            expect(validates(validUsername, 'a'.repeat(21))).toBe(false);
        });

        test('rejects special characters', () => {
            expect(validates(validUsername, 'user name')).toBe(false);
            expect(validates(validUsername, 'user@name')).toBe(false);
        });
    });

    describe('validPassword', () => {
        test('accepts valid passwords', () => {
            expect(validates(validPassword, 'password')).toBe(true); // 8 chars
            expect(validates(validPassword, 'MyP@ss!23')).toBe(true);
            expect(validates(validPassword, 'a'.repeat(30))).toBe(true); // max length
        });

        test('rejects too short', () => {
            expect(validates(validPassword, 'short')).toBe(false);
            expect(validates(validPassword, '1234567')).toBe(false); // 7 chars
        });

        test('rejects too long', () => {
            expect(validates(validPassword, 'a'.repeat(31))).toBe(false);
        });
    });

    describe('validEmail', () => {
        test('accepts valid emails', () => {
            expect(validates(validEmail, 'user@gmail.com')).toBe(true);
            expect(validates(validEmail, 'test@example.net')).toBe(true);
        });

        test('rejects missing @', () => {
            expect(validates(validEmail, 'notanemail')).toBe(false);
        });

        test('rejects unsupported TLD', () => {
            expect(validates(validEmail, 'user@example.zsh')).toBe(false);
            expect(validates(validEmail, 'user@example.io')).toBe(false);
        });

        test('rejects single domain segment', () => {
            expect(validates(validEmail, 'user@localhost')).toBe(false);
        });
    });

    describe('validPhone', () => {
        test('accepts valid phone numbers', () => {
            expect(validates(validPhone, '1234567890')).toBe(true);
            expect(validates(validPhone, '123-456-7890')).toBe(true);
            expect(validates(validPhone, '(123) 456-7890')).toBe(true);
            expect(validates(validPhone, '+1 123 456 7890')).toBe(true);
        });

        test('rejects non-numeric strings', () => {
            expect(validates(validPhone, 'helloworld')).toBe(false);
            expect(validates(validPhone, 'pancakes')).toBe(false);
        });

        test('rejects too long', () => {
            expect(validates(validPhone, '1'.repeat(51))).toBe(false);
        });
    });
});
