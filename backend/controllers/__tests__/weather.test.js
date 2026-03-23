import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import request from 'supertest';

// mock weather service so no real HTTP or Redis calls
const mockGetCurrentWeather = jest.fn();
const mockGetHistoricalWeather = jest.fn();

jest.unstable_mockModule('../../services/weather.service.js', () => ({
    getCurrentWeather: mockGetCurrentWeather,
    getHistoricalWeather: mockGetHistoricalWeather,
}));

// also mock ioredis so app import doesn't try to connect to Redis
jest.unstable_mockModule('ioredis', () => ({
    default: jest.fn(() => ({
        get: jest.fn(),
        set: jest.fn(),
        on: jest.fn(),
        connect: jest.fn().mockResolvedValue(undefined),
    })),
}));

const { default: app } = await import('../../app.js');

describe('GET /api/weather/current', () => {
    beforeEach(() => jest.clearAllMocks());

    test('returns 200 with weather data for valid zip', async () => {
        const weatherData = { location: 'Boston', zip: '02101', temperature_2m: 68 };
        mockGetCurrentWeather.mockResolvedValue(weatherData);

        const res = await request(app)
            .get('/api/weather/current')
            .query({ zip: '02101' });

        expect(res.status).toBe(200);
        expect(res.body).toEqual(weatherData);
        expect(mockGetCurrentWeather).toHaveBeenCalledWith('02101');
    });

    test('returns 400 for missing zip', async () => {
        const res = await request(app)
            .get('/api/weather/current');

        expect(res.status).toBe(400);
        expect(mockGetCurrentWeather).not.toHaveBeenCalled();
    });

    test('returns 400 for malformed zip (non-numeric)', async () => {
        const res = await request(app)
            .get('/api/weather/current')
            .query({ zip: 'abcde' });

        expect(res.status).toBe(400);
        expect(mockGetCurrentWeather).not.toHaveBeenCalled();
    });

    test('returns 400 for zip with wrong length', async () => {
        const res = await request(app)
            .get('/api/weather/current')
            .query({ zip: '1234' });

        expect(res.status).toBe(400);
    });

    test('returns 500 when service throws', async () => {
        mockGetCurrentWeather.mockRejectedValue(new Error('API down'));

        const res = await request(app)
            .get('/api/weather/current')
            .query({ zip: '02101' });

        expect(res.status).toBe(500);
    });
});

describe('GET /api/weather/historical', () => {
    beforeEach(() => jest.clearAllMocks());

    test('returns 200 with historical data for valid params', async () => {
        const historicalData = { location: 'Boston', zip: '02101', daily: {} };
        mockGetHistoricalWeather.mockResolvedValue(historicalData);

        const res = await request(app)
            .get('/api/weather/historical')
            .query({ zip: '02101', start_date: '2024-01-01', end_date: '2024-01-07' });

        expect(res.status).toBe(200);
        expect(res.body).toEqual(historicalData);
        expect(mockGetHistoricalWeather).toHaveBeenCalledWith('02101', '2024-01-01', '2024-01-07');
    });

    test('returns 400 for missing start_date', async () => {
        const res = await request(app)
            .get('/api/weather/historical')
            .query({ zip: '02101', end_date: '2024-01-07' });

        expect(res.status).toBe(400);
    });

    test('returns 400 for missing end_date', async () => {
        const res = await request(app)
            .get('/api/weather/historical')
            .query({ zip: '02101', start_date: '2024-01-01' });

        expect(res.status).toBe(400);
    });

    test('returns 400 for malformed date format', async () => {
        const res = await request(app)
            .get('/api/weather/historical')
            .query({ zip: '02101', start_date: '01-01-2024', end_date: '2024-01-07' });

        expect(res.status).toBe(400);
    });

    test('returns 500 when service throws', async () => {
        mockGetHistoricalWeather.mockRejectedValue(new Error('API down'));

        const res = await request(app)
            .get('/api/weather/historical')
            .query({ zip: '02101', start_date: '2024-01-01', end_date: '2024-01-07' });

        expect(res.status).toBe(500);
    });
});
