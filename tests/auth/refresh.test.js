import request from 'supertest';
import app from '../../backend/app.js';
import Account from '../../backend/models/accounts.model.js';

async function insertUser(user) {
    const response = await request(app)
        .post('/api/accounts')
        .set('Accept', 'application/json')
        .send(user.fields)
        .expect(201);

    expect(response.body).toHaveProperty('accessToken');
    expect(response.headers).toHaveProperty('set-cookie');
    
    expect(response.body.accessToken).toBeDefined();
    expect(response.headers['set-cookie']).toBeDefined();

    return {
        access: response.body.accessToken,
        refresh: response.headers['set-cookie']
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
        
        // gets login creds
        const refreshCookie = auth['refresh'];
        const oldToken = auth['access'];

        // call /refresh and show the refreshToken
        const response = await request(app)
            .post('/api/auth/refresh')
            .set('Accept', 'application/json')
            .set('Cookie', refreshCookie[0].split(';')[0])
            .expect(200);
        
        // asserts the new token is not the same as the old token
        expect(response.body).toHaveProperty('accessToken');
        expect(response.body.token).not.toBe(oldToken);
        
    });

    test('fail to get new access token with no refresh token', async () => {
        const validUser = {
            fields: { email: 'successEmail@gmail.com', password: 'qwertyuiop' },
            isValid: true,
            errMsg: null
        };

        // insert user and get their access token
        const auth = await insertUser(validUser);

        // call /accounts without a token, expecting a failure
        await request(app)
            .post('/api/auth/refresh')
            .set('Accept', 'application/json')
            //.set('Cookie', refreshCookie[0].split(';')[0])
            .expect(401);
        
    });

    test('fail to get new access token with fake refresh token', async () => {
        const validUser = {
            fields: { email: 'successEmail@gmail.com', password: 'qwertyuiop' },
            isValid: true,
            errMsg: null
        };

        // insert user and get their access token
        const auth = await insertUser(validUser);

        // call /accounts with only one token (need both)
        await request(app)
            .post('/api/auth/refresh')
            .set('Accept', 'application/json')
            .set('Cookie', 'yippeeyabbabooo')
            .expect(401);
        
    });

    test('fail to get new access token with logged-out user\'s refresh token', async () => {
        
        /* This one needs a comment block to explain what's up

            Hypothetically, the refresh token can be stolen to abusively use 
            someone's account. if User A steals User B's refresh token, they can
            pretend to be User B without restriction.

            By implementing token tracing in the database, we set User B's tokens to null
            once they log out. So when User A attempts to authenticate as User B, they 
            are rejected. This wouldn't stop User A if User B was already logged in

        */
        
        
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
        const authA = await insertUser(validUserA);
        const authB = await insertUser(validUserB);

        // logs out validUserA
        await request(app)
            .post('/api/auth/logout')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${authA.access}`)
            .set('Cookie', authA.refresh[0].split(';')[0])
            .expect(200);
        
        // call /refresh with validUserA's refresh cookie
        // Should fail because validUserA is logged out, and
        // therefore needs to login again to be given new tokens
        await request(app)
            .post('/api/auth/refresh')
            .set('Accept', 'application/json')
            .set('Cookie', authA.refresh[0].split(';')[0])
            .expect(401);
        
    });
});

