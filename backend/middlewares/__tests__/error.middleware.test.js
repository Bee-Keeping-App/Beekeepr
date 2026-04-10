import request from 'supertest';
import app from '../../app.js';
import Account from '../../models/accounts.model.js';
import { createAccount } from '../../__tests__/helpers.js';
import { setMockUserId, clearMockUserId } from '../../__mocks__/clerk-express.js';
import errorHandler from '../error.middleware.js';
import {
    UnauthorizedUserError
} from '../../classes/errors.class.js';

// Builds a minimal response stub that tracks calls
function mockRes() {
    const calls = { status: undefined, json: undefined };
    const res = {
        status(code) { calls.status = code; return res; },
        json(data)   { calls.json  = data; return res; },
        calls
    };
    return res;
}

describe('Error middleware (integration)', () => {
    beforeAll(async () => {
        await Account.syncIndexes();
    });

    afterEach(() => {
        setMockUserId('test_clerk_user_123');
    });

    test('FailedValidationError maps to 400', async () => {
        // trigger validation error: missing required email on registration
        await request(app)
            .post('/api/accounts')
            .send({})
            .set('Accept', 'application/json')
            .expect(400);
    });

    test('Unauthenticated request returns 401', async () => {
        clearMockUserId();
        await request(app)
            .get('/api/accounts')
            .set('Accept', 'application/json')
            .expect(401);
    });

    test('NullQueryError maps to 404', async () => {
        await createAccount({ email: 'test@gmail.com' });
        const fakeId = '507f1f77bcf86cd799439011';

        await request(app)
            .get(`/api/accounts/${fakeId}`)
            .set('Accept', 'application/json')
            .expect(404);
    });

    test('DuplicateFieldError maps to 409', async () => {
        await createAccount({ email: 'dupe@gmail.com' });

        setMockUserId('clerk_user_other');
        await request(app)
            .post('/api/accounts')
            .send({ email: 'dupe@gmail.com' })
            .set('Accept', 'application/json')
            .expect(409);
    });
});

describe('Error middleware (unit)', () => {

    test('UnauthorizedUserError maps to 403', () => {
        const err = new UnauthorizedUserError('unauthorized');
        const res = mockRes();
        errorHandler(err, {}, res, () => {});
        expect(res.calls.status).toBe(403);
    });

    test('unknown error in dev mode (USE_PROD=false) returns detailed response', () => {
        const original = process.env.USE_PROD;
        process.env.USE_PROD = 'false';

        const err = new Error('some unexpected error');
        const res = mockRes();
        errorHandler(err, {}, res, () => {});

        expect(res.calls.status).toBe(500);
        expect(res.calls.json).toMatchObject({ message: 'some unexpected error' });

        process.env.USE_PROD = original;
    });

    test('unknown error in prod mode (USE_PROD=true) returns minimal response', () => {
        const original = process.env.USE_PROD;
        process.env.USE_PROD = 'true';

        const err = new Error('some unexpected error');
        const res = mockRes();
        errorHandler(err, {}, res, () => {});

        expect(res.calls.status).toBe(500);
        expect(res.calls.json).toEqual({ status: 'error', message: 'An unexpected error occurred' });

        process.env.USE_PROD = original;
    });
});
