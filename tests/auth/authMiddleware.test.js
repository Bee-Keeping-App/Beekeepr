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
    return response.body['token'];
}

describe('Testing Auth Middleware Responses', () => {
    beforeAll(async () => {
        
        // if I need to do anything before executing tests, it goes here
        await Account.syncIndexes(); // enforces the schema's unique property
    });

    afterEach(async () => {
        
        // empty the database
        await Account.deleteMany({});
    });

    test('Successfully authenticate for read', async () => {
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
        const tokenA = await insertUser(validUserA);
        const tokenB = await insertUser(validUserB);

        // call /accounts with one of the tokens
        const response = await request(app)
        .get('/api/accounts')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${tokenA}`)  // tokenA or tokenB works
        .expect(200);

        // verify response
        expect(response.body).toHaveProperty('accounts');
        expect(response.body.accounts).toHaveLength(2);
        const emails = response.body.accounts.map(u => u.email);
        expect(emails).toContain('successEmail@gmail.com'.toLowerCase());
        expect(emails).toContain('goodemail@gmail.com'.toLowerCase());

    });

    test('fail read due to lack of token', async () => {
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
        const tokenA = await insertUser(validUserA);
        const tokenB = await insertUser(validUserB);

        // call /accounts with one of the tokens
        await request(app)
        .get('/api/accounts')
        .set('Accept', 'application/json')
        .expect(401);

    });

    test('fail read due to fake token', async () => {
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
        const tokenA = await insertUser(validUserA);
        const tokenB = await insertUser(validUserB);

        // call /accounts with one of the tokens
        await request(app)
        .get('/api/accounts')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer heeheeheehaw`)  // tokenA or tokenB works
        .expect(401);
    });
});

