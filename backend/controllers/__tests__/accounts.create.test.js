import request from 'supertest';
import app from '../../app.js';
import Account from '../../models/accounts.model.js';

describe('POST /accounts', () => {
    beforeAll(async () => {
        await Account.syncIndexes();
    });

    test('returns tokens for successful registration', async () => {
        const response = await request(app)
            .post('/api/accounts')
            .set('Accept', 'application/json')
            .send({ email: 'successEmail@gmail.com', password: 'qwertyuiop' })
            .expect(201);

        // checks for access token
        expect(response.body).toHaveProperty('accessToken');

        // parsing http-only cookies
        const cookies = response.headers['set-cookie'];
        expect(cookies).toBeDefined();

        // checks for refresh token
        const refreshCookie = cookies.find(c => c.startsWith('refreshToken='));
        expect(refreshCookie).toBeDefined();
        expect(refreshCookie).toContain('HttpOnly');
    });

    test('fails insert due to missing email', async () => {
        await request(app)
            .post('/api/accounts')
            .set('Accept', 'application/json')
            .send({ password: 'qwertyuiop' })
            .expect(400);
    });

    test('fails insert due to malformed phone number', async () => {
        await request(app)
            .post('/api/accounts')
            .set('Accept', 'application/json')
            .send({ email: 'failure@gmail.com', password: 'hasbullah', phone: 'helloworld' })
            .expect(400);
    });

    test('fails insert due to duplicate email', async () => {
        // inserts a valid user
        await request(app)
            .post('/api/accounts')
            .set('Accept', 'application/json')
            .send({ email: 'successEmail@gmail.com', password: 'qwertyuiop' })
            .expect(201);

        // same email => should be rejected
        await request(app)
            .post('/api/accounts')
            .set('Accept', 'application/json')
            .send({ email: 'successEmail@gmail.com', password: 'notqwertyuiop' })
            .expect(409);
    });
});
