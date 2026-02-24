import request from 'supertest';
import app from '../../backend/app';
import Account from '../../backend/models/accounts.model';

// adds a user to the mocked database
async function insertUser(user) {
    const response = await request(app)
        .post('/api/accounts')
        .set('Accept', 'application/json')
        .send(user.fields)
        .expect(201);

    // check that tokens were returned
    expect(response.body).toHaveProperty('accessToken');
    expect(response.headers).toHaveProperty('set-cookie');


    // returns their tokens (needed for future operations on this user / as this user)
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

        // sends a delete request, expect 204 (resource deleted successfully signal)
        await request(app)
            .delete('/api/accounts')
            .send(validUser.fields)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${auth.access}`)
            .set('Cookie', auth.refresh[0].split(';')[0])
            .expect(204);

        // get request to double check the resource was deleted (expect 0 accounts)
        const response = await request(app)
            .get('/api/accounts')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${auth.access}`)
            .set('Cookie', auth.refresh[0].split(';')[0])
            .expect(200);

        // asserts expectation here
        expect(response.body).toHaveProperty('accounts');
        expect(response.body.accounts).toHaveLength(0);
    });
});

