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

    const refreshCookie = response.headers['set-cookie'];

    return {
        access: response.body.token,
        refresh: refreshCookie
    };
}

describe('POST /refresh', () => {
    beforeAll(async () => {
        
        // if I need to do anything before executing tests, it goes here
        await Account.syncIndexes(); // enforces the schema's unique property
    });

    afterEach(async () => {
        
        // empty the database
        await Account.deleteMany({});
    });

    test('successfully get new access token', async () => {
        const validUser = {
            fields: { email: 'successEmail@gmail.com', password: 'qwertyuiop' },
            isValid: true,
            errMsg: null
        };

        // insert user and get their access token
        const auth = await insertUser(validUser);
        
        const refreshCookie = auth['refresh'];
        const oldToken = auth['access'];

        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        sleep(1000);

        // call /refresh and show the refreshToken
        const response = await request(app)
            .post('/api/auth/refresh')
            .set('Accept', 'application/json')
            .set('Cookie', refreshCookie[0].split(';')[0])
            .expect(200);
        
        expect(response.body).toHaveProperty('token');

        console.log('old token:', oldToken);
        console.log('new token:', response.body.token);

        expect(response.body.token).not.toBe(oldToken);
        
    });

    test('fail to get new access token with no refresh token', async () => {
        const validUser = {
            fields: { email: 'successEmail@gmail.com', password: 'qwertyuiop' },
            isValid: true,
            errMsg: null
        };

        // insert user and get their access token
        const { accessToken, refreshCookie } = await insertUser(validUser);

        // call /accounts with one of the tokens
        await request(app)
            .post('/api/auth/refresh')
            .set('Accept', 'application/json')
            //.set('Cookie', refreshCookie[0].split(';')[0])
            .expect(401);
        
    });

    test('fail to get new access token with no fake refresh token', async () => {
        const validUser = {
            fields: { email: 'successEmail@gmail.com', password: 'qwertyuiop' },
            isValid: true,
            errMsg: null
        };

        // insert user and get their access token
        const { accessToken, refreshCookie } = await insertUser(validUser);

        // call /accounts with one of the tokens
        await request(app)
            .post('/api/auth/refresh')
            .set('Accept', 'application/json')
            .set('Cookie', 'yippeeyabbabooo')
            .expect(404);
        
    });

    test('fail to get new access token with logged-out user\'s refresh token', async () => {
        const validUserA = {
            fields: { email: 'successEmail@gmail.com', password: 'qwertyuiop' },
            isValid: true,
            errMsg: null
        };

        const validUserB = {
            fields: { email: 'goodemail@gmail.com', password: 'blablabla' },
            isValid: true,
            errMsg: null
        };

        // insert user and get their access token
        const { accessTokenA, refreshCookieA } = await insertUser(validUserA);
        const { accessTokenB, refreshCookieB } = await insertUser(validUserB);

        await request(app)
            .post('/api/auth/logout')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${tokenA}`)
            .expect(204);
        
        // call /refresh with the other's refresh cookie
        await request(app)
            .post('/api/auth/refresh')
            .set('Accept', 'application/json')
            .set('Cookie', refreshCookieA[0].split(';')[0])
            .expect(403);
        
    });
});

