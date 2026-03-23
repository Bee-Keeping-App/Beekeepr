import { getRedisClient } from '../utils/redisClient.js';

export const TTL = {
    weather: 10 * 60,     // 10 minutes
    historical: 60 * 60,  // 1 hour
};

export async function getCached(key) {
    try {
        const client = getRedisClient();
        const value = await client.get(key);

        if (value !== null) {
            console.log(`[Cache] HIT ${key}`);
            return JSON.parse(value);
        }

        console.log(`[Cache] MISS ${key}`);
        return null;
    } catch (err) {
        console.warn(`[Cache] GET failed for ${key}:`, err.message);
        return null;
    }
}

export async function setCached(key, value, ttl) {
    try {
        const client = getRedisClient();
        await client.set(key, JSON.stringify(value), 'EX', ttl);
    } catch (err) {
        console.warn(`[Cache] SET failed for ${key}:`, err.message);
    }
}
