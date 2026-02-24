import request from 'supertest';
import app from '../../backend/app.js';
import Account from '../../backend/models/accounts.model.js';

async function insertUser(user) {
    const response = await request(app)
        .post('/api/accounts')
        .set('Accept', 'application/json')
        .send(user.fields)
        .expect(201);

    // check that tokens were returned
    expect(response.body).toHaveProperty('accessToken');
    expect(response.headers).toHaveProperty('set-cookie');

    // get the user's tokens (necessary for future ops)
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

        /* The flow for login is weird 
            Because login is different from register,
            You need to register first, log the user out,
            THEN test login because register is different
        */


        // registering the user
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
        // login implies no active auth tokens, so don't send any
        const response = await request(app)
            .post('/api/auth/login')
            .send(validUser.fields)
            .set('Accept', 'application/json')
            .expect(200);


        // verify response
        // checks for access token
        console.log(response.body);

        // parsing tokens
        const refresh = response.headers['set-cookie'];
        const access = response.body.accessToken;

        // ensures a user gets their tokens upon login
        expect(refresh).toBeDefined();
        expect(access).toBeDefined();
    });

    test('failed log in due to missing field(s)', async () => {
        var invalidUser = {
            fields: { email: 'successEmail@gmail.com', password: 'qwertyuiop' },
            isValid: true,
            errMsg: null
        };

        // register a valid user
        const auth = await insertUser(invalidUser);

        // call /accounts with one of the tokens
        await request(app)
            .post('/api/auth/logout')
            .send(invalidUser.fields)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${auth.access}`)
            .set('Cookie', auth.refresh[0].split(';')[0])
            .expect(200);
        

        // now try logging in with a null password
        invalidUser.fields['password'] = null;

        // this should fail
        await request(app)
            .post('/api/auth/login')
            .send(invalidUser.fields)
            .set('Accept', 'application/json')
            .expect(400);

        // try again, but with a null email (should still fail)
        invalidUser.fields['email'] = null;
        invalidUser.fields['password'] = 'qwertyuiop';
        
        // expect a 400 (failure)
        await request(app)
            .post('/api/auth/login')
            .send(invalidUser.fields)
            .set('Accept', 'application/json')
            .expect(400);


        // now everything is null
        invalidUser.fields['password'] = null;

        // expect a failure
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

        // register
        const auth = await insertUser(invalidUser);

        // call /accounts with one of the tokens
        await request(app)
            .post('/api/auth/logout')
            .send(invalidUser.fields)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${auth.access}`)
            .set('Cookie', auth.refresh[0].split(';')[0])
            .expect(200);
        

        // now test with an invalid password
        invalidUser.fields['password'] = '123bananas';

        // expect failure
        await request(app)
            .post('/api/auth/login')
            .send(invalidUser.fields)
            .set('Accept', 'application/json')
            .expect(401);

        // try with right password wrong email
        invalidUser.fields['email'] = 'bademail@gmail.com';
        invalidUser.fields['password'] = 'qwertyuiop';
        
        // expect failure
        await request(app)
            .post('/api/auth/login')
            .send(invalidUser.fields)
            .set('Accept', 'application/json')
            .expect(401);

        // everything is now wrong 
        invalidUser.fields['password'] = '123bananas';

        // expect failure
        await request(app)
            .post('/api/auth/login')
            .send(invalidUser.fields)
            .set('Accept', 'application/json')
            .expect(401);
    });
});

