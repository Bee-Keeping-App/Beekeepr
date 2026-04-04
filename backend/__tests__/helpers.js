import request from 'supertest';
import app from '../app.js';
import { setMockUserId } from '../__mocks__/clerk-express.js';

/**
 * Creates an account via the API as an authenticated Clerk user.
 * @param {Object} fields - { email, phone? }
 * @param {string} [clerkId='test_clerk_user_123'] - the mock Clerk user ID
 * @returns {Object} the created account object
 */
export async function createAccount(fields, clerkId = 'test_clerk_user_123') {
    setMockUserId(clerkId);
    const response = await request(app)
        .post('/api/accounts')
        .set('Accept', 'application/json')
        .send(fields)
        .expect(201);
    return response.body.account;
}
