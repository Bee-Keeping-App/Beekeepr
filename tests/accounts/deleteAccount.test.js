const request = require('supertest');
const app = require('../../backend/app');
const Account = require('../../backend/models/accounts.model');

async function insertUser(user) {
    const response = await request(app)
        .post('/api/accounts')
        .set('Accept', 'application/json')
        .send(user.fields)
        .expect(201);

    // check that tokens were returned
    expect(response.body).toHaveProperty('accessToken');
    expect(response.headers).toHaveProperty('set-cookie');

    return {
        access: response.body.accessToken,
        refresh: response.headers['set-cookie']
    };
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

        const auth = await insertUser(validUser);

        // call /accounts with one of the tokens
        await request(app)
            .delete('/api/accounts')
            .send(validUser.fields)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${auth.access}`)
            .set('Cookie', auth.refresh[0].split(';')[0])
            .expect(204);

        const response = await request(app)
            .get('/api/accounts')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${auth.access}`)
            .set('Cookie', auth.refresh[0].split(';')[0])
            .expect(200);

        expect(response.body).toHaveProperty('accounts');
        expect(response.body.accounts).toHaveLength(0);
    });
});

