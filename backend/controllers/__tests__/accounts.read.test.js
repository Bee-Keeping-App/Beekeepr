import request from 'supertest';
import app from '../../app.js';
import Account from '../../models/accounts.model.js';
import { registerUser, withAuth } from '../../__tests__/helpers.js';

describe('GET /accounts', () => {
    beforeAll(async () => {
        await Account.syncIndexes();
    });

    test('successfully read all users', async () => {
        await registerUser({ email: 'successEmail@gmail.com', password: 'qwertyuiop' });
        const tokensB = await registerUser({ email: 'goodemail@gmail.com', password: 'blablabla' });

        const response = await withAuth(
            request(app).get('/api/accounts').set('Accept', 'application/json'),
            tokensB
        ).expect(200);

        expect(response.body).toHaveProperty('accounts');
        expect(response.body.accounts).toHaveLength(2);

        const emails = response.body.accounts.map(u => u.email);
        expect(emails).toContain('successemail@gmail.com');
        expect(emails).toContain('goodemail@gmail.com');
    });

    test('successfully read 1 user', async () => {
        const tokensA = await registerUser({ email: 'successEmail@gmail.com', password: 'qwertyuiop' });
        await registerUser({ email: 'goodemail@gmail.com', password: 'blablabla' });

        // fetch all users to get target ID
        const allUsers = await withAuth(
            request(app).get('/api/accounts').set('Accept', 'application/json'),
            tokensA
        ).expect(200);

        const targetId = allUsers.body.accounts.find(u => u.email === 'goodemail@gmail.com').id;

        // fetch target user by ID
        const response = await withAuth(
            request(app).get(`/api/accounts/${targetId}`).set('Accept', 'application/json'),
            tokensA
        ).expect(200);

        expect(response.body).toHaveProperty('account');
        expect(response.body.account).toHaveProperty('_id', targetId);
        expect(response.body.account).toHaveProperty('email', 'goodemail@gmail.com');
    });
});
