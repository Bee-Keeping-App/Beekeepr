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
        const tokenA = await insertUser(authedUser);
        const tokenB = await insertUser(targetUser);

        // call /accounts with one of the tokens
        // fetch all users to get a valid ID for targetUser
        const allUsers = await request(app)
            .get('/accounts')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${tokenA}`)
            .expect(200);

        // pick target user's ID
        const targetId = allUsers.body.find(u => u.email === targetUser.fields.email)._id;

        // fetch one user by ID
        const response = await request(app)
            .get(`/accounts/${targetId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${tokenA}`)
            .expect(200);

        // verify response
        expect(response.body).toHaveProperty('_id', targetId);
        expect(response.body).toHaveProperty('email', targetUser.fields.email);
    });
});

