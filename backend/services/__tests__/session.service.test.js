import { refreshSession } from '../session.service.js';
import Account from '../../models/accounts.model.js';
import { signRefreshToken } from '../tokens.service.js';
import { InvalidTokenError, ExpiredTokenError } from '../../classes/errors.class.js';
import jwt from 'jsonwebtoken';

describe('session.service - refreshSession', () => {
    beforeAll(async () => {
        await Account.syncIndexes();
    });

    // Creates a minimal user directly in the DB (bypasses HTTP/validation layer)
    async function createUser(email = 'session-test@gmail.com') {
        return Account.create({
            email,
            password: 'plaintextpassword', // hashed by pre-save hook
            accessId: 1,
            refreshId: 1
        });
    }

    test('returns owner and accessToken for a valid refresh token', async () => {
        const user = await createUser();
        const token = signRefreshToken({ owner: { id: user.id }, version: 1 });

        const result = await refreshSession(token);

        expect(result).toHaveProperty('accessToken');
        expect(result).toHaveProperty('owner');
        expect(typeof result.accessToken).toBe('string');
    });

    test('throws InvalidTokenError for a garbage token string', async () => {
        await expect(refreshSession('garbage.token.here')).rejects.toThrow(InvalidTokenError);
    });

    test('throws InvalidTokenError when token version does not match user refreshId', async () => {
        const user = await createUser('session-revoked@gmail.com');
        // version: 0 is stale — user's refreshId is 1 (e.g. after a logout incremented it)
        const staleToken = signRefreshToken({ owner: { id: user.id }, version: 0 });

        await expect(refreshSession(staleToken)).rejects.toThrow(InvalidTokenError);
    });

    test('throws ExpiredTokenError for an expired refresh token', async () => {
        const user = await createUser();
        const expiredToken = jwt.sign(
            { owner: { id: user.id }, version: 1 },
            process.env.REFRESH_SECRET,
            { expiresIn: '0s' }
        );

        await expect(refreshSession(expiredToken)).rejects.toThrow(ExpiredTokenError);
    });
});
