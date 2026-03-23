import { jest, describe, test, expect, beforeEach } from '@jest/globals';

const mockGet = jest.fn();
const mockSet = jest.fn();
const mockOn = jest.fn();
const mockConnect = jest.fn().mockResolvedValue(undefined);

jest.unstable_mockModule('../../utils/redisClient.js', () => ({
    getRedisClient: jest.fn(() => ({
        get: mockGet,
        set: mockSet,
        on: mockOn,
        connect: mockConnect,
    })),
}));

const { getCached, setCached, TTL } = await import('../cache.service.js');

describe('cache.service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('TTL constants', () => {
        test('weather TTL is 10 minutes', () => {
            expect(TTL.weather).toBe(600);
        });

        test('historical TTL is 1 hour', () => {
            expect(TTL.historical).toBe(3600);
        });
    });

    describe('getCached', () => {
        test('returns parsed value and logs HIT on cache hit', async () => {
            const payload = { temperature: 72, zip: '12345' };
            mockGet.mockResolvedValue(JSON.stringify(payload));
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

            const result = await getCached('weather:12345');

            expect(result).toEqual(payload);
            expect(consoleSpy).toHaveBeenCalledWith('[Cache] HIT weather:12345');
            consoleSpy.mockRestore();
        });

        test('returns null and logs MISS on cache miss', async () => {
            mockGet.mockResolvedValue(null);
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

            const result = await getCached('weather:99999');

            expect(result).toBeNull();
            expect(consoleSpy).toHaveBeenCalledWith('[Cache] MISS weather:99999');
            consoleSpy.mockRestore();
        });

        test('returns null and logs warning when Redis throws', async () => {
            mockGet.mockRejectedValue(new Error('ECONNREFUSED'));
            const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

            const result = await getCached('weather:12345');

            expect(result).toBeNull();
            expect(warnSpy).toHaveBeenCalledWith(
                '[Cache] GET failed for weather:12345:',
                'ECONNREFUSED'
            );
            warnSpy.mockRestore();
        });
    });

    describe('setCached', () => {
        test('calls redis SET with correct args', async () => {
            mockSet.mockResolvedValue('OK');
            const payload = { temperature: 72 };

            await setCached('weather:12345', payload, TTL.weather);

            expect(mockSet).toHaveBeenCalledWith(
                'weather:12345',
                JSON.stringify(payload),
                'EX',
                TTL.weather
            );
        });

        test('logs warning and does not throw when Redis throws', async () => {
            mockSet.mockRejectedValue(new Error('ECONNREFUSED'));
            const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

            await expect(setCached('weather:12345', {}, TTL.weather)).resolves.toBeUndefined();
            expect(warnSpy).toHaveBeenCalledWith(
                '[Cache] SET failed for weather:12345:',
                'ECONNREFUSED'
            );
            warnSpy.mockRestore();
        });
    });
});
