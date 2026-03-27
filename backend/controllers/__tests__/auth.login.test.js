import request from 'supertest';
import app from '../../app.js';
import Account from '../../models/accounts.model.js';
import { registerUser, withAuth } from '../../__tests__/helpers.js';

describe('POST /login', () => {
    beforeAll(async () => {
        await Account.syncIndexes();
    });

    test('successfully log in', async () => {
        const creds = { email: 'successEmail@gmail.com', password: 'qwertyuiop' };
        const auth = await registerUser(creds);

        // log out first
        await withAuth(
            request(app).post('/api/auth/logout').set('Accept', 'application/json'),
            auth
        ).expect(200);

        // now log back in
        const response = await request(app)
            .post('/api/auth/login')
            .send(creds)
            .set('Accept', 'application/json')
            .expect(200);

        expect(response.body.accessToken).toBeDefined();
        expect(response.headers['set-cookie']).toBeDefined();
    });

    test('failed log in due to missing field(s)', async () => {
        const creds = { email: 'successEmail@gmail.com', password: 'qwertyuiop' };
        const auth = await registerUser(creds);

        await withAuth(
            request(app).post('/api/auth/logout').set('Accept', 'application/json'),
            auth
        ).expect(200);

        // null password
        await request(app)
            .post('/api/auth/login')
            .send({ email: creds.email, password: null })
            .set('Accept', 'application/json')
            .expect(400);

        // null email
        await request(app)
            .post('/api/auth/login')
            .send({ email: null, password: creds.password })
            .set('Accept', 'application/json')
            .expect(400);

        // both null
        await request(app)
            .post('/api/auth/login')
            .send({ email: null, password: null })
            .set('Accept', 'application/json')
            .expect(400);
    });

    test('failed log in due to invalid credentials', async () => {
        const creds = { email: 'successEmail@gmail.com', password: 'qwertyuiop' };
        const auth = await registerUser(creds);

        await withAuth(
            request(app).post('/api/auth/logout').set('Accept', 'application/json'),
            auth
        ).expect(200);

        // wrong password
        await request(app)
            .post('/api/auth/login')
            .send({ email: creds.email, password: '123bananas' })
            .set('Accept', 'application/json')
            .expect(401);

        // wrong email
        await request(app)
            .post('/api/auth/login')
            .send({ email: 'bademail@gmail.com', password: creds.password })
            .set('Accept', 'application/json')
            .expect(401);

        // both wrong
        await request(app)
            .post('/api/auth/login')
            .send({ email: 'bademail@gmail.com', password: '123bananas' })
            .set('Accept', 'application/json')
            .expect(401);
    });
});
