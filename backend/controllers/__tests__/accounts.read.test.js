import request from 'supertest';
import app from '../../app.js';
import Account from '../../models/accounts.model.js';
import { createAccount } from '../../__tests__/helpers.js';
import { setMockUserId } from '../../__mocks__/clerk-express.js';

describe('GET /accounts', () => {
    beforeAll(async () => {
        await Account.syncIndexes();
    });

    afterEach(() => {
        setMockUserId('test_clerk_user_123');
    });

    test('successfully read all users', async () => {
        await createAccount({ email: 'successEmail@gmail.com' }, 'clerk_user_a');
        await createAccount({ email: 'goodemail@gmail.com' }, 'clerk_user_b');

        setMockUserId('clerk_user_b');
        const response = await request(app)
            .get('/api/accounts')
            .set('Accept', 'application/json')
            .expect(200);

        expect(response.body).toHaveProperty('accounts');
        expect(response.body.accounts).toHaveLength(2);

        const emails = response.body.accounts.map(u => u.email);
        expect(emails).toContain('successemail@gmail.com');
        expect(emails).toContain('goodemail@gmail.com');
    });

    test('successfully read 1 user', async () => {
        await createAccount({ email: 'successEmail@gmail.com' }, 'clerk_user_a');
        await createAccount({ email: 'goodemail@gmail.com' }, 'clerk_user_b');

        // fetch all users to get target ID
        setMockUserId('clerk_user_a');
        const allUsers = await request(app)
            .get('/api/accounts')
            .set('Accept', 'application/json')
            .expect(200);

        const targetId = allUsers.body.accounts.find(u => u.email === 'goodemail@gmail.com').id;

        // fetch target user by ID
        const response = await request(app)
            .get(`/api/accounts/${targetId}`)
            .set('Accept', 'application/json')
            .expect(200);

        expect(response.body).toHaveProperty('account');
        expect(response.body.account).toHaveProperty('_id', targetId);
        expect(response.body.account).toHaveProperty('email', 'goodemail@gmail.com');
    });
});
