import request from 'supertest';
import app from '../../app.js';
import Account from '../../models/accounts.model.js';
import { createAccount } from '../../__tests__/helpers.js';
import { setMockUserId } from '../../__mocks__/clerk-express.js';

describe('PUT /accounts', () => {
    beforeAll(async () => {
        await Account.syncIndexes();
    });

    afterEach(() => {
        setMockUserId('test_clerk_user_123');
    });

    test('successfully update email', async () => {
        await createAccount({ email: 'successEmail@gmail.com' });

        const response = await request(app)
            .put('/api/accounts')
            .send({ email: 'newEmail@gmail.com' })
            .set('Accept', 'application/json')
            .expect(200);

        expect(response.body).toHaveProperty('account');
        expect(response.body.account).toHaveProperty('email');
        expect(response.body.account.email).toBe('newemail@gmail.com');
    });

    test('fail because missing email', async () => {
        await createAccount({ email: 'successEmail@gmail.com' });

        await request(app)
            .put('/api/accounts')
            .send({ email: null })
            .set('Accept', 'application/json')
            .expect(400);
    });

    test('fail because malformed phone', async () => {
        await createAccount({ email: 'successEmail@gmail.com' });

        await request(app)
            .put('/api/accounts')
            .send({ email: 'successEmail@gmail.com', phone: 'pancakes' })
            .set('Accept', 'application/json')
            .expect(400);
    });

    test('successfully add phone number', async () => {
        await createAccount({ email: 'successEmail@gmail.com' });
        const phone = '1234567890';

        const response = await request(app)
            .put('/api/accounts')
            .send({ email: 'successEmail@gmail.com', phone })
            .set('Accept', 'application/json')
            .expect(200);

        expect(response.body).toHaveProperty('account');
        expect(response.body.account).toHaveProperty('phone');
        expect(response.body.account.phone).toBe(phone);
    });
});
