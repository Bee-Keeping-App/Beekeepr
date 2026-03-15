/**
 * Unit tests for auth.controller.js::register.
 *
 * NOTE: This controller function is not attached to any route — registration
 * goes through POST /api/accounts → accounts.controller.js::registerAccount.
 * These tests call the exported function directly to maintain coverage of the
 * dead-code path until the duplication is resolved.
 */
import { register } from '../auth.controller.js';
import Account from '../../models/accounts.model.js';
import { DuplicateFieldError } from '../../classes/errors.class.js';

describe('auth.controller - register (unit)', () => {
    beforeAll(async () => {
        await Account.syncIndexes();
    });

    /**
     * catchAsync wraps the controller but doesn't return its Promise, so
     * `await register(req, res, next)` resolves before the async work is done.
     * We wrap the call ourselves: resolve when res.json fires, reject when next
     * receives an error.
     */
    function invokeRegister(body) {
        return new Promise((resolve, reject) => {
            const result = {};
            const req = { body };
            const res = {
                status(code)             { result.status = code; return res; },
                json(data)               { result.data = data; resolve(result); return res; },
                cookie(name, val, opts)  { result.cookie = { name, val, opts }; return res; }
            };
            register(req, res, (err) => reject(err));
        });
    }

    test('sets refreshToken cookie and returns 201 with accessToken', async () => {
        const result = await invokeRegister({ email: 'register-test@gmail.com', password: 'qwertyuiop' });

        expect(result.status).toBe(201);
        expect(result.data).toHaveProperty('accessToken');
        expect(typeof result.data.accessToken).toBe('string');
        expect(result.cookie.name).toBe('refreshToken');
        expect(result.cookie.opts).toMatchObject({ httpOnly: true });
    });

    test('rejects with DuplicateFieldError on duplicate email', async () => {
        const body = { email: 'dupe-register@gmail.com', password: 'qwertyuiop' };

        // first registration succeeds
        await invokeRegister(body);

        // second registration with same email should error through next()
        await expect(invokeRegister(body)).rejects.toBeInstanceOf(DuplicateFieldError);
    });
});
