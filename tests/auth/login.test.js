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

describe('POST /login', () => {
    beforeAll(async () => {
        
        // if I need to do anything before executing tests, it goes here
        await Account.syncIndexes(); // enforces the schema's unique property
    });

    afterEach(async () => {

        // empty the database
        await Account.deleteMany({});
    });

    test('successfully log in', async () => {
        var validUser = {
            fields: { email: 'successEmail@gmail.com', password: 'qwertyuiop' },
            isValid: true,
            errMsg: null
        };

        const auth = await insertUser(validUser);

        // log out validUser
        await request(app)
            .post('/api/auth/logout')
            .send(validUser.fields)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${auth.access}`)
            .set('Cookie', auth.refresh[0].split(';')[0])
            .expect(200);
        

        // now try logging them in again
        // login implies no active auth tokens
        const response = await request(app)
            .post('/api/auth/login')
            .send(validUser.fields)
            .set('Accept', 'application/json')
            .expect(200);


        // verify response
        // checks for access token
        expect(response.body).toHaveProperty('accessToken');
        expect(response.cookies).toHaveProperty('set-cookie');

        // parsing tokens
        const refresh = response.headers['set-cookie'];
        const access = response.body.accessToken;

        expect(refresh).toBeDefined();
        expect(access).toBeDefined();
    });

    test('failed log in due to missing field(s)', async () => {
        var invalidUser = {
            fields: { email: 'successEmail@gmail.com', password: 'qwertyuiop' },
            isValid: true,
            errMsg: null
        };

        const auth = await insertUser(invalidUser);

        // call /accounts with one of the tokens
        await request(app)
            .post('/api/auth/logout')
            .send(invalidUser.fields)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${auth.access}`)
            .set('Cookie', auth.refresh[0].split(';')[0])
            .expect(200);
        

        invalidUser['password'] = null;

        await request(app)
            .post('/api/auth/login')
            .send(invalidUser.fields)
            .set('Accept', 'application/json')
            .expect(400);

        invalidUser['email'] = null;
        invalidUser['password'] = 'qwertyuiop';
        
        await request(app)
            .post('/api/auth/login')
            .send(invalidUser.fields)
            .set('Accept', 'application/json')
            .expect(400);

        invalidUser['password'] = null;

        await request(app)
            .post('/api/auth/login')
            .send(invalidUser.fields)
            .set('Accept', 'application/json')
            .expect(400);
    });

    test('failed log in due to invalid credentials', async () => {
        var invalidUser = {
            fields: { email: 'successEmail@gmail.com', password: 'qwertyuiop' },
            isValid: true,
            errMsg: null
        };

        const token = await insertUser(invalidUser);

        // call /accounts with one of the tokens
        await request(app)
            .post('/api/auth/logout')
            .send(invalidUser.fields)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .expect(204);
        

        invalidUser['password'] = '123bananas';

        await request(app)
            .post('/api/auth/login')
            .send(invalidUser.fields)
            .set('Accept', 'application/json')
            .expect(404);

        invalidUser['email'] = 'bademail@gmail.com';
        invalidUser['password'] = 'qwertyuiop';
        
        await request(app)
            .post('/api/auth/login')
            .send(invalidUser.fields)
            .set('Accept', 'application/json')
            .expect(401);

        invalidUser['password'] = '123bananas';

        await request(app)
            .post('/api/auth/login')
            .send(invalidUser.fields)
            .set('Accept', 'application/json')
            .expect(401);
    });
});

