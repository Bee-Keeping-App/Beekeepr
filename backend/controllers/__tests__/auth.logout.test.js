import request from 'supertest';
import app from '../../app.js';
import Account from '../../models/accounts.model.js';
import { registerUser, withAuth } from '../../__tests__/helpers.js';

describe('POST /logout', () => {
    beforeAll(async () => {
        await Account.syncIndexes();
    });

    test('successfully log out', async () => {
        const auth = await registerUser({ email: 'successEmail@gmail.com', password: 'qwertyuiop' });

        await withAuth(
            request(app).post('/api/auth/logout').set('Accept', 'application/json'),
            auth
        ).expect(200);
    });
});
