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

describe('PUT /accounts', () => {
    beforeAll(async () => {
        
        // if I need to do anything before executing tests, it goes here
        await Account.syncIndexes(); // enforces the schema's unique property
    });

    afterEach(async () => {

        // empty the database
        await Account.deleteMany({});
    });

    test('successfully update all fields', async () => {
        var validUser = {
            fields: { email: 'successEmail@gmail.com', password: 'qwertyuiop' },
            isValid: true,
            errMsg: null
        };

        const token = await insertUser(validUser);
        
        validUser['fields']['email'] = 'newEmail@gmail.com';
        validUser['fields']['password'] = 'newpassword';

        // call /accounts with one of the tokens
        const response = await request(app)
            .put('/api/accounts')
            .send(validUser.fields)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        

        // verify response
        expect(response.body).toHaveProperty('account');
        expect(response.body.account).toHaveProperty('email');
        expect(response.body.account.email).toBe('newEmail@gmail.com'.toLowerCase());
    });

    test('fail because missing email', async () => {
        var validUser = {
            fields: { email: 'successEmail@gmail.com', password: 'qwertyuiop' },
            isValid: true,
            errMsg: null
        };

        const token = await insertUser(validUser);
        
        validUser['fields']['email'] = null;
        validUser['fields']['password'] = 'newpassword';

        // call /accounts with one of the tokens
        await request(app)
            .put('/api/accounts')
            .send(validUser.fields)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
    });

    test('fail because malformed phone', async () => {
        var validUser = {
            fields: { email: 'successEmail@gmail.com', password: 'qwertyuiop' },
            isValid: true,
            errMsg: null
        };

        const token = await insertUser(validUser);
        
        validUser['fields']['phone'] = 'pancakes';

        // call /accounts with one of the tokens
        await request(app)
            .put('/api/accounts')
            .send(validUser.fields)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .expect(400);
    });

    test('successfully add phone number', async () => {
        var validUser = {
            fields: { email: 'successEmail@gmail.com', password: 'qwertyuiop' },
            isValid: true,
            errMsg: null
        };

        const token = await insertUser(validUser);
        
        validUser['fields']['phone'] = 1234567890;

        // call /accounts with one of the tokens
        const response = await request(app)
            .put('/api/accounts')
            .send(validUser.fields)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        // verify response
        expect(response.body).toHaveProperty('account');
        expect(response.body.account).toHaveProperty('phone');
        expect(response.body.account.phone).toBe(1234567890);
    });
});

