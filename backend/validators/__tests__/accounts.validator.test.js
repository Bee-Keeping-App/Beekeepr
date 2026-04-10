import { findOne, create, update } from '../accounts.validator.js';

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
        test('accepts valid email', () => {
            expect(validates(create(), { email: 'user@gmail.com' })).toBe(true);
        });

        test('accepts with optional phone', () => {
            expect(validates(create(), { email: 'user@gmail.com', phone: '1234567890' })).toBe(true);
        });

        test('rejects missing email', () => {
            expect(validates(create(), {})).toBe(false);
        });

        test('rejects invalid email format', () => {
            expect(validates(create(), { email: 'notanemail' })).toBe(false);
        });
    });

    describe('update', () => {
        test('accepts partial update with email only', () => {
            expect(validates(update(), { email: 'new@gmail.com' })).toBe(true);
        });

        test('accepts empty body (all fields optional)', () => {
            expect(validates(update(), {})).toBe(true);
        });

        test('rejects invalid email in update', () => {
            expect(validates(update(), { email: 'notvalid' })).toBe(false);
        });
    });
});
