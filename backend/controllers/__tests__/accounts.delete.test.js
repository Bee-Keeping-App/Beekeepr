import request from 'supertest';
import app from '../../app.js';
import Account from '../../models/accounts.model.js';
import { registerUser, withAuth } from '../../__tests__/helpers.js';

describe('DELETE /accounts', () => {
    beforeAll(async () => {
        await Account.syncIndexes();
    });

    test('successfully delete an account', async () => {
        const tokens = await registerUser({ email: 'successEmail@gmail.com', password: 'qwertyuiop' });

        // sends a delete request
        await withAuth(
            request(app)
                .delete('/api/accounts')
                .set('Accept', 'application/json'),
            tokens
        ).expect(204);

        // verify account was deleted
        const response = await withAuth(
            request(app)
                .get('/api/accounts')
                .set('Accept', 'application/json'),
            tokens
        ).expect(200);

        expect(response.body).toHaveProperty('accounts');
        expect(response.body.accounts).toHaveLength(0);
    });
});
