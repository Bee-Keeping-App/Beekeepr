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

    return {
        access: response.body.accessToken,
        refresh: response.headers['set-cookie']
    };
}

describe('POST /logout', () => {
    beforeAll(async () => {
        
        // if I need to do anything before executing tests, it goes here
        await Account.syncIndexes(); // enforces the schema's unique property
    });

    afterEach(async () => {

        // empty the database
        await Account.deleteMany({});
    });

    test('successfully log out', async () => {
        var validUser = {
            fields: { email: 'successEmail@gmail.com', password: 'qwertyuiop' },
            isValid: true,
            errMsg: null
        };

        const auth = await insertUser(validUser);
        
        await request(app)
            .post('/api/auth/logout')
            .send(validUser.fields)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${auth.access}`)
            .set('Cookie', auth.refresh[0].split(';')[0])
            .expect(200);
    });
});

