import request from 'supertest';
import app from '../../app.js';
import Account from '../../models/accounts.model.js';
import { setMockUserId, clearMockUserId } from '../../__mocks__/clerk-express.js';
import { createAccount } from '../../__tests__/helpers.js';

describe('Protected account routes (Clerk auth)', () => {
    beforeAll(async () => {
        await Account.syncIndexes();
    });

    afterEach(() => {
        setMockUserId('test_clerk_user_123');
    });

    describe('unauthenticated requests return 401', () => {
        test('GET /accounts without auth returns 401', async () => {
            clearMockUserId();
            await request(app)
                .get('/api/accounts')
                .set('Accept', 'application/json')
                .expect(401);
        });

        test('POST /accounts without auth returns 401', async () => {
            clearMockUserId();
            await request(app)
                .post('/api/accounts')
                .set('Accept', 'application/json')
                .send({ email: 'test@gmail.com' })
                .expect(401);
        });

        test('PUT /accounts without auth returns 401', async () => {
            clearMockUserId();
            await request(app)
                .put('/api/accounts')
                .send({ email: 'new@gmail.com' })
                .set('Accept', 'application/json')
                .expect(401);
        });

        test('DELETE /accounts without auth returns 401', async () => {
            clearMockUserId();
            await request(app)
                .delete('/api/accounts')
                .set('Accept', 'application/json')
                .expect(401);
        });
    });

    describe('non-existent resources', () => {
        test('GET /accounts/:id with non-existent ID returns 404', async () => {
            await createAccount({ email: 'test@gmail.com' });
            const fakeId = '507f1f77bcf86cd799439011';

            await request(app)
                .get(`/api/accounts/${fakeId}`)
                .set('Accept', 'application/json')
                .expect(404);
        });
    });

    describe('validation edge cases', () => {
        test('POST /accounts with unsupported email TLD returns 400', async () => {
            await request(app)
                .post('/api/accounts')
                .set('Accept', 'application/json')
                .send({ email: 'test@example.org' })
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
                .send({ email: 'phoneguy@gmail.com', phone: '555-123-4567' })
                .expect(201);

            expect(response.body).toHaveProperty('account');
            expect(response.body.account).toHaveProperty('email', 'phoneguy@gmail.com');
        });
    });
});
