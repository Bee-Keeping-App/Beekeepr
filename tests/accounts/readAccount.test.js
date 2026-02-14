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

describe('GET /accounts', () => {
    beforeAll(async () => {
        
        // if I need to do anything before executing tests, it goes here
        await Account.syncIndexes(); // enforces the schema's unique property
    });

    afterEach(async () => {
        
        // empty the database
        await Account.deleteMany({});
    });

    test('successfully read all users', async () => {
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

        // insert users and get their tokens
        const tokensA = await insertUser(validUserA);
        const tokensB = await insertUser(validUserB);

        // call /accounts with one of the tokens
        const response = await request(app)
            .get('/api/accounts')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${tokensB.access}`)  // tokenA or tokenB works
            .set('Cookie', tokensB.refresh[0].split(';')[0])
            .expect(200);

        // verify response
        expect(response.body).toHaveProperty('accounts')
        expect(response.body.accounts).toHaveLength(2);
        
        const emails = response.body.accounts.map(u => u.email);
        
        expect(emails).toContain('successEmail@gmail.com'.toLowerCase());
        expect(emails).toContain('goodemail@gmail.com'.toLowerCase());
    });

    test('successfully read 1 user', async () => {
        const authedUser = {
            fields: { email: 'successEmail@gmail.com', password: 'qwertyuiop' },
            isValid: true,
            errMsg: null
        };

        const targetUser = {
            fields: { email: 'goodemail@gmail.com', password: 'blablabla' },
            isValid: true,
            errMsg: null
        };

        // insert users and get their tokens
        const tokensA = await insertUser(authedUser);
        const tokensB = await insertUser(targetUser);

        // call /accounts with one of the tokens
        // fetch all users to get a valid ID for targetUser
        const allUsers = await request(app)
            .get('/api/accounts')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${tokensA.access}`)  // tokenA or tokenB works
            .set('Cookie', tokensA.refresh[0].split(';')[0])
            .expect(200);
        
        
        // pick target user's ID
        const targetId = allUsers.body.accounts.find(u => u.email === (targetUser.fields.email.toLowerCase())).id;

        // fetch one user by ID
        const response = await request(app)
            .get(`/api/accounts/${targetId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${tokensA.access}`)  // tokenA or tokenB works
            .set('Cookie', tokensA.refresh[0].split(';')[0])
            .expect(200);

        // verify response
        expect(response.body).toHaveProperty('account');
        expect(response.body.account).toHaveProperty('_id', targetId);
        expect(response.body.account).toHaveProperty('email', targetUser.fields.email.toLowerCase());
    });
});

