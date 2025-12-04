const request = require('supertest');
const app = require('../../backend/app');
const Account = require('../../backend/accounts.model');

describe('POST /accounts', () => {
    beforeAll(async () => {
        
        // if I need to do anything before executing tests, it goes here
        await Account.syncIndexes(); // enforces the schema's unique property
    });

    afterEach(async () => {

        // empty the database
        await Account.deleteMany({});
    });

    test('returns tokens for successful registration', () => {
        const validUser = {
            fields: { email: 'successEmail@gmail.com', password: 'qwertyuiop' },
            isValid: true,
            errMsg: null
        };

        return request(app)
        .post('/accounts')
        .set('Accept', 'application/json')
        .send(validUser.fields)
        .expect(201)    // 201 bc POST makes a server resource
        .then(response => {
            
            // checks for access token
            expect(response.body).toHaveProperty('token');
            
            // parsing http-only cookies
            const cookies = response.headers['set-cookie'];
            expect(cookies).toBeDefined();

            // checks for refresh token
            const refreshCookie = cookies.find(c => c.startsWith('refreshToken='));
            expect(refreshCookie).toBeDefined();
            expect(refreshCookie).toContain('HttpOnly');
        });
    });

    test('fails insert due to missing email', async () => {
        const invalidUser = {
                'fields': { "password": 'qwertyuiop' },
                'isVailid': false,
                'errMsg': "missing email"
        };

        return request(app)
        .post('/accounts')
        .set('Accept', 'application/json')
        .send(invalidUser.fields)
        .expect(400);
    });

    test('fails insert due to malformed phone number', async () => {
        const invalidUser = {
            'fields': { "email": 'failure@gmail.com', "password": 'hasbullah', "phone": 'helloworld' },
            'isValid': false,
            'errMsg': "Phone number needs to be a number"
        };

        return request(app)
        .post('/accounts')
        .set('Accept', 'application/json')
        .send(invalidUser.fields)
        .expect(400);
    });

    test('fails insert due to duplicate email', async () => {
        const validUser = {
            fields: { email: 'successEmail@gmail.com', password: 'qwertyuiop' },
            isValid: true,
            errMsg: null
        };

        const invalidUser = {
            fields: { email: 'successEmail@gmail.com', password: 'notqwertyuiop' },
            isValid: false,
            errMsg: "Email already in use"
        };

        // inserts a valid user
        await request(app)
        .post('/accounts')
        .set('Accept', 'application/json')
        .send(validUser.fields)
        .expect(201);
        
        // fails inserting bc of duplicate email
        return request(app)
        .post('/accounts')
        .set('Accept', 'application/json')
        .send(invalidUser.fields)
        .expect(400);
    });
});

