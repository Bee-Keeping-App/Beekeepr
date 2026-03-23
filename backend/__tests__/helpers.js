import request from 'supertest';
import app from '../app.js';

/**
 * Registers a user via the API and returns their auth tokens.
 * @param {Object} fields - { email, password, phone? }
 * @returns {{ access: string, refresh: string[] }}
 */
export async function registerUser(fields) {
    const response = await request(app)
        .post('/api/accounts')
        .set('Accept', 'application/json')
        .send(fields)
        .expect(201);

    expect(response.body).toHaveProperty('accessToken');
    expect(response.headers).toHaveProperty('set-cookie');

    return {
        access: response.body.accessToken,
        refresh: response.headers['set-cookie']
    };
}

/**
 * Applies auth headers (access token + refresh cookie) to a supertest request.
 */
export function withAuth(req, tokens) {
    return req
        .set('Authorization', `Bearer ${tokens.access}`)
        .set('Cookie', tokens.refresh[0].split(';')[0]);
}
