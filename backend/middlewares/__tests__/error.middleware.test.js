import request from 'supertest';
import app from '../../app.js';
import Account from '../../models/accounts.model.js';
import { registerUser, withAuth } from '../../__tests__/helpers.js';
import errorHandler from '../error.middleware.js';
import jwt from 'jsonwebtoken';
import {
    ExpiredTokenError,
    WrongPasswordError,
    UnauthorizedUserError
} from '../../classes/errors.class.js';

// Builds a minimal response stub that tracks calls without needing jest globals
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

    test('FailedValidationError maps to 400', async () => {
        // trigger validation error: missing required email on registration
        await request(app)
            .post('/api/accounts')
            .send({ password: 'qwertyuiop' })
            .set('Accept', 'application/json')
            .expect(400);
    });

    test('MissingTokenError maps to 400', async () => {
        // accessing protected route without tokens
        await request(app)
            .get('/api/accounts')
            .set('Accept', 'application/json')
            .expect(400);
    });

    test('InvalidTokenError maps to 401', async () => {
        const tokens = await registerUser({ email: 'test@gmail.com', password: 'qwertyuiop' });

        // valid access token but fabricated refresh cookie
        await request(app)
            .get('/api/accounts')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${tokens.access}`)
            .set('Cookie', 'refreshToken=invalidjwtstring')
            .expect(401);
    });

    test('UnauthenticatedUserError maps to 401 (wrong password login)', async () => {
        const creds = { email: 'test@gmail.com', password: 'qwertyuiop' };
        await registerUser(creds);

        await request(app)
            .post('/api/auth/login')
            .send({ email: creds.email, password: 'wrongpasswd' })
            .set('Accept', 'application/json')
            .expect(401);
    });

    test('NullQueryError maps to 404', async () => {
        const tokens = await registerUser({ email: 'test@gmail.com', password: 'qwertyuiop' });
        const fakeId = '507f1f77bcf86cd799439011';

        await withAuth(
            request(app).get(`/api/accounts/${fakeId}`).set('Accept', 'application/json'),
            tokens
        ).expect(404);
    });

    test('DuplicateFieldError maps to 409', async () => {
        await registerUser({ email: 'dupe@gmail.com', password: 'qwertyuiop' });

        await request(app)
            .post('/api/accounts')
            .send({ email: 'dupe@gmail.com', password: 'differentpw' })
            .set('Accept', 'application/json')
            .expect(409);
    });

    test('ExpiredTokenError maps to 401 (expired access token on protected route)', async () => {
        const auth = await registerUser({ email: 'test@gmail.com', password: 'qwertyuiop' });

        const expiredAccess = jwt.sign(
            { owner: { id: 'someid' }, version: 1 },
            process.env.ACCESS_SECRET,
            { expiresIn: '0s' }
        );

        await request(app)
            .get('/api/accounts')
            .set('Authorization', `Bearer ${expiredAccess}`)
            .set('Cookie', auth.refresh[0].split(';')[0])
            .expect(401);
    });
});

describe('Error middleware (unit) — unreachable-via-HTTP branches', () => {

    test('ExpiredTokenError maps to 401', () => {
        const err = new ExpiredTokenError('token expired');
        const res = mockRes();
        errorHandler(err, {}, res, () => {});
        expect(res.calls.status).toBe(401);
    });

    test('WrongPasswordError maps to 401', () => {
        const err = new WrongPasswordError('wrong password');
        const res = mockRes();
        errorHandler(err, {}, res, () => {});
        expect(res.calls.status).toBe(401);
    });

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
