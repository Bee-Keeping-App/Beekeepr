import request from 'supertest';
import app from '../../app.js';
import Account from '../../models/accounts.model.js';
import { createAccount } from '../../__tests__/helpers.js';
import { setMockUserId } from '../../__mocks__/clerk-express.js';

describe('DELETE /accounts', () => {
    beforeAll(async () => {
        await Account.syncIndexes();
    });

    afterEach(() => {
        setMockUserId('test_clerk_user_123');
    });

    test('successfully delete an account', async () => {
        await createAccount({ email: 'successEmail@gmail.com' });

        // sends a delete request
        await request(app)
            .delete('/api/accounts')
            .set('Accept', 'application/json')
            .expect(204);

        // verify account was deleted
        const response = await request(app)
            .get('/api/accounts')
            .set('Accept', 'application/json')
            .expect(200);

        expect(response.body).toHaveProperty('accounts');
        expect(response.body.accounts).toHaveLength(0);
    });
});
