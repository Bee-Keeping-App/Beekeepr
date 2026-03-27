import { findOne, create, update, deleteOne } from '../accounts.validator.js';

function validates(schema, value) {
    return !schema.validate(value).error;
}

describe('Accounts validators', () => {

    describe('findOne', () => {
        test('accepts an id', () => {
            expect(validates(findOne(), { id: '507f1f77bcf86cd799439011' })).toBe(true);
        });

        test('rejects missing id', () => {
            expect(validates(findOne(), {})).toBe(false);
        });
    });

    describe('create', () => {
        test('accepts valid email and password', () => {
            expect(validates(create(), { email: 'user@gmail.com', password: 'qwertyuiop' })).toBe(true);
        });

        test('accepts with optional phone', () => {
            expect(validates(create(), { email: 'user@gmail.com', password: 'qwertyuiop', phone: '1234567890' })).toBe(true);
        });

        test('rejects missing email', () => {
            expect(validates(create(), { password: 'qwertyuiop' })).toBe(false);
        });

        test('rejects missing password', () => {
            expect(validates(create(), { email: 'user@gmail.com' })).toBe(false);
        });

        test('rejects invalid email format', () => {
            expect(validates(create(), { email: 'notanemail', password: 'qwertyuiop' })).toBe(false);
        });

        test('rejects too-short password', () => {
            expect(validates(create(), { email: 'user@gmail.com', password: 'short' })).toBe(false);
        });
    });

    describe('update', () => {
        test('accepts partial update with email only', () => {
            expect(validates(update(), { email: 'new@gmail.com' })).toBe(true);
        });

        test('accepts partial update with password only', () => {
            expect(validates(update(), { password: 'newpassword' })).toBe(true);
        });

        test('accepts empty body (all fields optional)', () => {
            expect(validates(update(), {})).toBe(true);
        });

        test('rejects invalid email in update', () => {
            expect(validates(update(), { email: 'notvalid' })).toBe(false);
        });
    });

    describe('deleteOne', () => {
        test('accepts valid username and password', () => {
            expect(validates(deleteOne(), { username: 'alice', password: 'qwertyuiop' })).toBe(true);
        });

        test('rejects missing username', () => {
            expect(validates(deleteOne(), { password: 'qwertyuiop' })).toBe(false);
        });

        test('rejects missing password', () => {
            expect(validates(deleteOne(), { username: 'alice' })).toBe(false);
        });

        test('rejects too-short username', () => {
            expect(validates(deleteOne(), { username: 'ab', password: 'qwertyuiop' })).toBe(false);
        });
    });
});
