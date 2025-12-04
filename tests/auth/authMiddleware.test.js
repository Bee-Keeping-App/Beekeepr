const request = require('supertest');
const app = require('../../backend/app');
const Account = require('../../backend/accounts.model');

function insertUser(user) { 
    return request(app)
    .post('/accounts')
    .set('Accept', 'application/json')
    .send(user.fields)
    .expect(201)    // 201 bc POST makes a server resource
    .then(response => {
        
        // checks for access token
        expect(response.body).toHaveProperty('token');

        // return the token (for sending future requests as an authenticated user)
        return response.body['token'];

    });
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
        .get('/accounts')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${tokenA}`)  // tokenA or tokenB works
        .expect(200);

        // verify response
        expect(response.body).toHaveLength(2);
        const emails = response.body.map(u => u.email);
        expect(emails).toContain('successEmail@gmail.com');
        expect(emails).toContain('goodemail@gmail.com');

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
        .get('/accounts')
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
        .get('/accounts')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer heeheeheehaw`)  // tokenA or tokenB works
        .expect(401);
    });
});

