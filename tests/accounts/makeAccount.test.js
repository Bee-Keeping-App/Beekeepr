import request from 'supertest';
import app from '../../backend/app.js';
import Account from '../../backend/resources/users/accounts.model.js';

describe('POST /accounts', () => {
    beforeAll(async () => {
        
        // if I need to do anything before executing tests, it goes here
        await Account.syncIndexes(); // enforces the schema's unique property
    });

    afterEach(async () => {

        // empty the database
        await Account.deleteMany({});
    });

    // this ensures when a user registers they get tokens
    test('returns tokens for successful registration', async () => {
        const validUser = {
            fields: { email: 'successEmail@gmail.com', password: 'qwertyuiop' },
            isValid: true,
            errMsg: null
        };

        // registering the user via posting to the accounts route
        const response = await request(app)
        .post('/api/accounts')
        .set('Accept', 'application/json')
        .send(validUser.fields)
        .expect(201)    // 201 bc POST makes a server resource
    
        
        // checks for access token
        expect(response.body).toHaveProperty('accessToken');
        
        // parsing http-only cookies
        const cookies = response.headers['set-cookie'];
        expect(cookies).toBeDefined();

        // checks for refresh token
        const refreshCookie = cookies.find(c => c.startsWith('refreshToken='));
        expect(refreshCookie).toBeDefined();
        expect(refreshCookie).toContain('HttpOnly');
        

        // because we have the access & refresh token, this test succeeded
    });

    test('fails insert due to missing email', async () => {
        const invalidUser = {
                'fields': { "password": 'qwertyuiop' },
                'isVailid': false,
                'errMsg': "missing email"
        };

        // we send the post, expecting it to be rejected
        // because the email is missing
        return request(app)
        .post('/api/accounts')
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

        // we send a bad phone number ==> expect a 400
        return request(app)
        .post('/api/accounts')
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
        .post('/api/accounts')
        .set('Accept', 'application/json')
        .send(validUser.fields)
        .expect(201);
        
        // this user has the same email && emails are unique ==> this should be rejected
        return request(app)
        .post('/api/accounts')
        .set('Accept', 'application/json')
        .send(invalidUser.fields)
        .expect(409);
    });
});

