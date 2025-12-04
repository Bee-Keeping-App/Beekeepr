const request = require('supertest');
const app = require('../../backend/app');
const Account = require('../../backend/models/accounts.model');

async function insertUser(user) {
    const response = await request(app)
        .post('/api/accounts')
        .set('Accept', 'application/json')
        .send(user.fields)
        .expect(201);

    expect(response.body).toHaveProperty('token');
    return response.body['token'];
}

describe('DELETE /accounts', () => {
    beforeAll(async () => {
        
        // if I need to do anything before executing tests, it goes here
        await Account.syncIndexes(); // enforces the schema's unique property
    });

    afterEach(async () => {

        // empty the database
        await Account.deleteMany({});
    });

    test('successfully delete an account', async () => {
        var validUser = {
            fields: { email: 'successEmail@gmail.com', password: 'qwertyuiop' },
            isValid: true,
            errMsg: null
        };

        const token = await insertUser(validUser);

        // call /accounts with one of the tokens
        await request(app)
            .delete('/api/accounts')
            .send(validUser.fields)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .expect(204);

        const response = await request(app)
            .get('/api/accounts')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(response.body).toHaveProperty('accounts');
        expect(response.body.accounts).toHaveLength(0);
    });
});

