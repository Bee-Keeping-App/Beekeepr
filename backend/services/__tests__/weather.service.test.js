import { jest, describe, test, expect, beforeEach, afterEach, beforeAll } from '@jest/globals';

const mockGetCached = jest.fn();
const mockSetCached = jest.fn();

jest.unstable_mockModule('../cache.service.js', () => ({
    getCached: mockGetCached,
    setCached: mockSetCached,
    TTL: { weather: 600, historical: 3600 },
}));

const { getCurrentWeather, getHistoricalWeather } = await import('../weather.service.js');

const GEO_RESPONSE = {
    results: [{ latitude: 42.36, longitude: -71.06, name: 'Boston' }],
};

const FORECAST_RESPONSE = {
    current: {
        temperature_2m: 68,
        relative_humidity_2m: 55,
        wind_speed_10m: 12,
        weathercode: 1,
    },
};

const ARCHIVE_RESPONSE = {
    daily: {
        time: ['2024-01-01'],
        temperature_2m_max: [40],
        temperature_2m_min: [28],
        precipitation_sum: [0.1],
    },
};

function mockFetch(...responses) {
    let call = 0;
    global.fetch = jest.fn(() => {
        const res = responses[call++] ?? responses[responses.length - 1];
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(res),
        });
    });
}

describe('weather.service', () => {
    let originalFetch;

    beforeAll(() => {
        originalFetch = global.fetch;
    });

    beforeEach(() => {
        jest.clearAllMocks();
        mockGetCached.mockResolvedValue(null);
    });

    afterEach(() => {
        global.fetch = originalFetch;
    });

    describe('getCurrentWeather', () => {
        test('returns cached value without calling API on cache hit', async () => {
            const cached = { location: 'Boston', zip: '02101', temperature_2m: 70 };
            mockGetCached.mockResolvedValue(cached);
            const fetchSpy = jest.spyOn(global, 'fetch');

            const result = await getCurrentWeather('02101');

            expect(result).toEqual(cached);
            expect(fetchSpy).not.toHaveBeenCalled();
            expect(mockSetCached).not.toHaveBeenCalled();
            fetchSpy.mockRestore();
        });

        test('fetches from API, caches, and returns data on cache miss', async () => {
            mockFetch(GEO_RESPONSE, FORECAST_RESPONSE);

            const result = await getCurrentWeather('02101');

            expect(result.zip).toBe('02101');
            expect(result.location).toBe('Boston');
            expect(result.temperature_2m).toBe(68);
            expect(mockSetCached).toHaveBeenCalledWith(
                'weather:02101',
                expect.objectContaining({ zip: '02101' }),
                600
            );
        });

        test('uses cache key weather:{zip}', async () => {
            mockFetch(GEO_RESPONSE, FORECAST_RESPONSE);
            await getCurrentWeather('02101');
            expect(mockGetCached).toHaveBeenCalledWith('weather:02101');
        });

        test('throws when geocoding finds no results', async () => {
            global.fetch = jest.fn().mockResolvedValue({
                ok: true,
                json: () => Promise.resolve({ results: [] }),
            });

            await expect(getCurrentWeather('00000')).rejects.toThrow('No location found for zip: 00000');
        });

        test('throws when weather API returns non-ok status', async () => {
            global.fetch = jest.fn()
                .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(GEO_RESPONSE) })
                .mockResolvedValueOnce({ ok: false, status: 500, json: () => Promise.resolve({}) });

            await expect(getCurrentWeather('02101')).rejects.toThrow('Weather API error: 500');
        });
    });

    describe('getHistoricalWeather', () => {
        test('returns cached value without calling API on cache hit', async () => {
            const cached = { location: 'Boston', zip: '02101', daily: {} };
            mockGetCached.mockResolvedValue(cached);
            const fetchSpy = jest.spyOn(global, 'fetch');

            const result = await getHistoricalWeather('02101', '2024-01-01', '2024-01-07');

            expect(result).toEqual(cached);
            expect(fetchSpy).not.toHaveBeenCalled();
            fetchSpy.mockRestore();
        });

        test('fetches from API, caches, and returns data on cache miss', async () => {
            mockFetch(GEO_RESPONSE, ARCHIVE_RESPONSE);

            const result = await getHistoricalWeather('02101', '2024-01-01', '2024-01-07');

            expect(result.zip).toBe('02101');
            expect(result.location).toBe('Boston');
            expect(result.daily).toBeDefined();
            expect(mockSetCached).toHaveBeenCalledWith(
                'historical:02101',
                expect.objectContaining({ zip: '02101' }),
                3600
            );
        });

        test('uses cache key historical:{zip}', async () => {
            mockFetch(GEO_RESPONSE, ARCHIVE_RESPONSE);
            await getHistoricalWeather('02101', '2024-01-01', '2024-01-07');
            expect(mockGetCached).toHaveBeenCalledWith('historical:02101');
        });

        test('throws when historical API returns non-ok status', async () => {
            global.fetch = jest.fn()
                .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(GEO_RESPONSE) })
                .mockResolvedValueOnce({ ok: false, status: 404, json: () => Promise.resolve({}) });

            await expect(
                getHistoricalWeather('02101', '2024-01-01', '2024-01-07')
            ).rejects.toThrow('Historical weather API error: 404');
        });
    });
});
