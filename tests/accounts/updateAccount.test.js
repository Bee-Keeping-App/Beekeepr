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


    // get the user's tokens (necessary for ops in the future)
    return {
        access: response.body.accessToken,
        refresh: response.headers['set-cookie']
    };
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

        const auth = await insertUser(validUser);
        
        // changing these fields, and then sending them in the request
        validUser['fields']['email'] = 'newEmail@gmail.com';
        validUser['fields']['password'] = 'newpassword';

        // call /accounts with one of the tokens
        const response = await request(app)
            .put('/api/accounts')
            .send(validUser.fields)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${auth.access}`)
            .set('Cookie', auth.refresh[0].split(';')[0])
            .expect(200);
        

        // verify the response has the new email
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

        const auth = await insertUser(validUser);
        
        // we inserted with a valid email, and now are removing the email
        // we should fail because our new account doesn't have an email
        validUser['fields']['email'] = null;
        validUser['fields']['password'] = 'newpassword';

        // call /accounts with one of the tokens
        await request(app)
            .put('/api/accounts')
            .send(validUser.fields)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${auth.access}`)
            .set('Cookie', auth.refresh[0].split(';')[0])
            .expect(400);
    });

    test('fail because malformed phone', async () => {
        var validUser = {
            fields: { email: 'successEmail@gmail.com', password: 'qwertyuiop' },
            isValid: true,
            errMsg: null
        };

        const auth = await insertUser(validUser);
        
        // we add a phone field that will violate the schema
        // so we expect a 400 
        validUser['fields']['phone'] = 'pancakes';

        // call /accounts with one of the tokens
        await request(app)
            .put('/api/accounts')
            .send(validUser.fields)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${auth.access}`)
            .set('Cookie', auth.refresh[0].split(';')[0])
            .expect(400);
    });

    test('successfully add phone number', async () => {
        var validUser = {
            fields: { email: 'successEmail@gmail.com', password: 'qwertyuiop' },
            isValid: true,
            errMsg: null
        };

        const auth = await insertUser(validUser);
        
        // try successfully adding a phone number
        validUser['fields']['phone'] = 1234567890;

        // call /accounts with one of the tokens
        const response = await request(app)
            .put('/api/accounts')
            .send(validUser.fields)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${auth.access}`)
            .set('Cookie', auth.refresh[0].split(';')[0])
            .expect(200);

        // verify the response is positive and the resource was successfully updated
        expect(response.body).toHaveProperty('account');
        expect(response.body.account).toHaveProperty('phone');
        expect(response.body.account.phone).toBe(1234567890);
    });
});

