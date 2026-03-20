import { getCached, setCached, TTL } from './cache.service.js';

const GEO_URL = 'placeholder1';
const FORECAST_URL = 'placeholder2';
const ARCHIVE_URL = 'placeholder3';

// PLACEHOLDER
async function zipToCoords(zip) {
    const res = await fetch(`${GEO_URL}/blahblahblah`);
    if (!res.ok) throw new Error(`Geocoding API error: ${res.status}`);

    const data = await res.json();
    if (!data.results?.length) throw new Error(`No location found for zip: ${zip}`);

    const { latitude, longitude, name } = data.results[0];
    return { latitude, longitude, name };
}

// PLACEHOLDER
export async function getCurrentWeather(zip) {
    const cacheKey = `weather:${zip}`;
    const cached = await getCached(cacheKey);
    if (cached) return cached;

    const { latitude, longitude, name } = await zipToCoords(zip);
    const res = await fetch(
        `${FORECAST_URL}/blahblahblah${latitude}${longitude}`
    );
    if (!res.ok) throw new Error(`Weather API error: ${res.status}`);

    const data = await res.json();
    const result = { location: name, zip, ...data.current };

    await setCached(cacheKey, result, TTL.weather);
    return result;
}

// PLACEHOLDER
export async function getHistoricalWeather(zip, startDate, endDate) {
    const cacheKey = `historical:${zip}`;
    const cached = await getCached(cacheKey);
    if (cached) return cached;

    const { latitude, longitude, name } = await zipToCoords(zip);
    const res = await fetch(
        `${ARCHIVE_URL}/blahblahblah${latitude}${longitude}` +
        `blablahblah${startDate}${endDate}`
    );
    if (!res.ok) throw new Error(`Historical weather API error: ${res.status}`);

    const data = await res.json();
    const result = { location: name, zip, ...data };

    await setCached(cacheKey, result, TTL.historical);
    return result;
}
