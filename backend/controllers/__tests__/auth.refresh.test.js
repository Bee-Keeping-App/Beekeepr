import request from 'supertest';
import app from '../../app.js';
import Account from '../../models/accounts.model.js';
import { registerUser, withAuth } from '../../__tests__/helpers.js';

describe('POST /refresh', () => {
    beforeAll(async () => {
        await Account.syncIndexes();
    });

    test('successfully get new access token', async () => {
        const auth = await registerUser({ email: 'successEmail@gmail.com', password: 'qwertyuiop' });

        const response = await request(app)
            .post('/api/auth/refresh')
            .set('Accept', 'application/json')
            .set('Cookie', auth.refresh[0].split(';')[0])
            .expect(200);

        expect(response.body).toHaveProperty('accessToken');
        expect(response.body.accessToken).not.toBe(auth.access);
    });

    test('fail to get new access token with no refresh token', async () => {
        await registerUser({ email: 'successEmail@gmail.com', password: 'qwertyuiop' });

        await request(app)
            .post('/api/auth/refresh')
            .set('Accept', 'application/json')
            .expect(401);
    });

    test('fail to get new access token with fake refresh token', async () => {
        await registerUser({ email: 'successEmail@gmail.com', password: 'qwertyuiop' });

        await request(app)
            .post('/api/auth/refresh')
            .set('Accept', 'application/json')
            .set('Cookie', 'refreshToken=yippeeyabbabooo')
            .expect(401);
    });

    test('fail to get new access token with logged-out user\'s refresh token', async () => {
        const authA = await registerUser({ email: 'successEmail@gmail.com', password: 'qwertyuiop' });
        const authB = await registerUser({ email: 'goodemail@gmail.com', password: 'blablabla' });

        // log out user A
        await withAuth(
            request(app).post('/api/auth/logout').set('Accept', 'application/json'),
            authA
        ).expect(200);

        // try to refresh with A's (now-invalid) refresh token
        await request(app)
            .post('/api/auth/refresh')
            .set('Accept', 'application/json')
            .set('Cookie', authA.refresh[0].split(';')[0])
            .expect(401);
    });
});
