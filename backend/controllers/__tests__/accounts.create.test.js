import request from 'supertest';
import app from '../../app.js';
import Account from '../../models/accounts.model.js';
import { setMockUserId } from '../../__mocks__/clerk-express.js';

describe('POST /accounts', () => {
    beforeAll(async () => {
        await Account.syncIndexes();
    });

    afterEach(() => {
        setMockUserId('test_clerk_user_123');
    });

    test('returns account for successful registration', async () => {
        const response = await request(app)
            .post('/api/accounts')
            .set('Accept', 'application/json')
            .send({ email: 'successEmail@gmail.com' })
            .expect(201);

        expect(response.body).toHaveProperty('account');
        expect(response.body.account).toHaveProperty('email', 'successemail@gmail.com');
    });

    test('fails insert due to missing email', async () => {
        await request(app)
            .post('/api/accounts')
            .set('Accept', 'application/json')
            .send({})
            .expect(400);
    });

    test('fails insert due to malformed phone number', async () => {
        await request(app)
            .post('/api/accounts')
            .set('Accept', 'application/json')
            .send({ email: 'failure@gmail.com', phone: 'helloworld' })
            .expect(400);
    });

    test('fails insert due to duplicate email', async () => {
        await request(app)
            .post('/api/accounts')
            .set('Accept', 'application/json')
            .send({ email: 'successEmail@gmail.com' })
            .expect(201);

        // different clerkId but same email => should be rejected
        setMockUserId('test_clerk_user_456');
        await request(app)
            .post('/api/accounts')
            .set('Accept', 'application/json')
            .send({ email: 'successEmail@gmail.com' })
            .expect(409);
    });
});
