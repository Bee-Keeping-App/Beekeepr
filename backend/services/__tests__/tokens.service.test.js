import {
    signAccessToken,
    signRefreshToken,
    validateAccessToken,
    validateRefreshToken
} from '../tokens.service.js';

import {
    ExpiredTokenError,
    InvalidTokenError
} from '../../classes/errors.class.js';

import jwt from 'jsonwebtoken';

const testPayload = {
    owner: { id: '507f1f77bcf86cd799439011' },
    version: 1
};

describe('Token service', () => {

    describe('signAccessToken', () => {
        test('returns a valid JWT string', () => {
            const token = signAccessToken(testPayload);
            expect(typeof token).toBe('string');
            expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
        });

        test('embeds owner and version in the payload', () => {
            const token = signAccessToken(testPayload);
            const decoded = jwt.decode(token);
            expect(decoded.owner).toEqual(testPayload.owner);
            expect(decoded.version).toBe(testPayload.version);
        });
    });

    describe('signRefreshToken', () => {
        test('returns a valid JWT string', () => {
            const token = signRefreshToken(testPayload);
            expect(typeof token).toBe('string');
            expect(token.split('.')).toHaveLength(3);
        });

        test('embeds owner and version in the payload', () => {
            const token = signRefreshToken(testPayload);
            const decoded = jwt.decode(token);
            expect(decoded.owner).toEqual(testPayload.owner);
            expect(decoded.version).toBe(testPayload.version);
        });
    });

    describe('validateAccessToken', () => {
        test('returns decoded payload for a valid token', () => {
            const token = signAccessToken(testPayload);
            const decoded = validateAccessToken(token);
            expect(decoded.owner).toEqual(testPayload.owner);
            expect(decoded.version).toBe(testPayload.version);
        });

        test('throws InvalidTokenError for a garbage string', () => {
            expect(() => validateAccessToken('not.a.token')).toThrow(InvalidTokenError);
        });

        test('throws InvalidTokenError for a refresh token (wrong secret)', () => {
            const refreshToken = signRefreshToken(testPayload);
            expect(() => validateAccessToken(refreshToken)).toThrow(InvalidTokenError);
        });

        test('throws ExpiredTokenError for an expired token', () => {
            // sign a token that expires immediately
            const token = jwt.sign(
                { owner: testPayload.owner, version: 1 },
                process.env.ACCESS_SECRET,
                { expiresIn: '0s' }
            );
            expect(() => validateAccessToken(token)).toThrow(ExpiredTokenError);
        });
    });

    describe('validateRefreshToken', () => {
        test('returns decoded payload for a valid token', () => {
            const token = signRefreshToken(testPayload);
            const decoded = validateRefreshToken(token);
            expect(decoded.owner).toEqual(testPayload.owner);
            expect(decoded.version).toBe(testPayload.version);
        });

        test('throws InvalidTokenError for a garbage string', () => {
            expect(() => validateRefreshToken('not.a.token')).toThrow(InvalidTokenError);
        });

        test('throws InvalidTokenError for an access token (wrong secret)', () => {
            const accessToken = signAccessToken(testPayload);
            expect(() => validateRefreshToken(accessToken)).toThrow(InvalidTokenError);
        });

        test('throws ExpiredTokenError for an expired token', () => {
            const token = jwt.sign(
                { owner: testPayload.owner, version: 1 },
                process.env.REFRESH_SECRET,
                { expiresIn: '0s' }
            );
            expect(() => validateRefreshToken(token)).toThrow(ExpiredTokenError);
        });
    });
});
