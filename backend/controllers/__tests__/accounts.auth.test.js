import request from 'supertest';
import app from '../../app.js';
import Account from '../../models/accounts.model.js';
import { registerUser, withAuth } from '../../__tests__/helpers.js';

describe('Protected account routes (auth middleware)', () => {
    beforeAll(async () => {
        await Account.syncIndexes();
    });

    describe('missing tokens', () => {
        test('GET /accounts without any auth returns 400', async () => {
            await request(app)
                .get('/api/accounts')
                .set('Accept', 'application/json')
                .expect(400);
        });

        test('GET /accounts with Bearer but no refresh cookie returns 400', async () => {
            const tokens = await registerUser({ email: 'test@gmail.com', password: 'qwertyuiop' });

            await request(app)
                .get('/api/accounts')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${tokens.access}`)
                // no refresh cookie
                .expect(400);
        });

        test('GET /accounts with refresh cookie but no Bearer returns 400', async () => {
            const tokens = await registerUser({ email: 'test@gmail.com', password: 'qwertyuiop' });

            await request(app)
                .get('/api/accounts')
                .set('Accept', 'application/json')
                .set('Cookie', tokens.refresh[0].split(';')[0])
                // no Authorization header
                .expect(400);
        });

        test('PUT /accounts without auth returns 400', async () => {
            await request(app)
                .put('/api/accounts')
                .send({ email: 'new@gmail.com', password: 'newpassword' })
                .set('Accept', 'application/json')
                .expect(400);
        });

        test('DELETE /accounts without auth returns 400', async () => {
            await request(app)
                .delete('/api/accounts')
                .set('Accept', 'application/json')
                .expect(400);
        });
    });

    describe('invalid tokens', () => {
        test('GET /accounts with fabricated Bearer token returns 401', async () => {
            const tokens = await registerUser({ email: 'test@gmail.com', password: 'qwertyuiop' });

            await request(app)
                .get('/api/accounts')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer faketoken123')
                .set('Cookie', tokens.refresh[0].split(';')[0])
                .expect(401);
        });

        test('GET /accounts with fabricated refresh cookie returns 401', async () => {
            const tokens = await registerUser({ email: 'test@gmail.com', password: 'qwertyuiop' });

            await request(app)
                .get('/api/accounts')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${tokens.access}`)
                .set('Cookie', 'refreshToken=fakecookievalue')
                .expect(401);
        });
    });

    describe('non-existent resources', () => {
        test('GET /accounts/:id with non-existent ID returns 404', async () => {
            const tokens = await registerUser({ email: 'test@gmail.com', password: 'qwertyuiop' });
            const fakeId = '507f1f77bcf86cd799439011'; // valid ObjectId format, but doesn't exist

            await withAuth(
                request(app)
                    .get(`/api/accounts/${fakeId}`)
                    .set('Accept', 'application/json'),
                tokens
            ).expect(404);
        });
    });

    describe('validation edge cases', () => {
        test('POST /accounts with too-short password returns 400', async () => {
            await request(app)
                .post('/api/accounts')
                .set('Accept', 'application/json')
                .send({ email: 'test@gmail.com', password: 'short' })
                .expect(400);
        });

        test('POST /accounts with unsupported email TLD returns 400', async () => {
            await request(app)
                .post('/api/accounts')
                .set('Accept', 'application/json')
                .send({ email: 'test@example.cum', password: 'qwertyuiop' })
                .expect(400);
        });

        test('POST /accounts with empty body returns 400', async () => {
            await request(app)
                .post('/api/accounts')
                .set('Accept', 'application/json')
                .send({})
                .expect(400);
        });

        test('POST /accounts with valid phone succeeds', async () => {
            const response = await request(app)
                .post('/api/accounts')
                .set('Accept', 'application/json')
                .send({ email: 'phoneguy@gmail.com', password: 'qwertyuiop', phone: '555-123-4567' })
                .expect(201);

            expect(response.body).toHaveProperty('accessToken');
        });
    });
});
