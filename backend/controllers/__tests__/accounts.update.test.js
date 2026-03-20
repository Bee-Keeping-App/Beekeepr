import request from 'supertest';
import app from '../../app.js';
import Account from '../../models/accounts.model.js';
import { registerUser, withAuth } from '../../__tests__/helpers.js';

describe('PUT /accounts', () => {
    beforeAll(async () => {
        await Account.syncIndexes();
    });

    test('successfully update all fields', async () => {
        const tokens = await registerUser({ email: 'successEmail@gmail.com', password: 'qwertyuiop' });

        const response = await withAuth(
            request(app)
                .put('/api/accounts')
                .send({ email: 'newEmail@gmail.com', password: 'newpassword' })
                .set('Accept', 'application/json'),
            tokens
        ).expect(200);

        expect(response.body).toHaveProperty('account');
        expect(response.body.account).toHaveProperty('email');
        expect(response.body.account.email).toBe('newemail@gmail.com');
    });

    test('fail because missing email', async () => {
        const tokens = await registerUser({ email: 'successEmail@gmail.com', password: 'qwertyuiop' });

        await withAuth(
            request(app)
                .put('/api/accounts')
                .send({ email: null, password: 'newpassword' })
                .set('Accept', 'application/json'),
            tokens
        ).expect(400);
    });

    test('fail because malformed phone', async () => {
        const tokens = await registerUser({ email: 'successEmail@gmail.com', password: 'qwertyuiop' });

        await withAuth(
            request(app)
                .put('/api/accounts')
                .send({ email: 'successEmail@gmail.com', password: 'qwertyuiop', phone: 'pancakes' })
                .set('Accept', 'application/json'),
            tokens
        ).expect(400);
    });

    test('successfully add phone number', async () => {
        const tokens = await registerUser({ email: 'successEmail@gmail.com', password: 'qwertyuiop' });
        const phone = '1234567890';

        const response = await withAuth(
            request(app)
                .put('/api/accounts')
                .send({ email: 'successEmail@gmail.com', password: 'qwertyuiop', phone })
                .set('Accept', 'application/json'),
            tokens
        ).expect(200);

        expect(response.body).toHaveProperty('account');
        expect(response.body.account).toHaveProperty('phone');
        expect(response.body.account.phone).toBe(phone);
    });
});
