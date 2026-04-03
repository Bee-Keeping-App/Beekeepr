import Redis from 'ioredis';

let client = null;

export function getRedisClient() {
    if (!client) {
        client = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            lazyConnect: true,
            enableOfflineQueue: false,
            maxRetriesPerRequest: 1,
        });

        client.on('connect', () => console.log('[Redis] Connected'));
        client.on('error', (err) => console.warn('[Redis] Error:', err.message));

        client.connect().catch((err) => {
            console.warn('[Redis] Could not connect, caching will be unavailable:', err.message);
        });
    }

    return client;
}
