import NodeCache from 'node-cache';

/**
 * In-memory cache for API responses
 * TTL: Time to live in seconds
 */
const cache = new NodeCache({
    stdTTL: 3600, // 1 hour default
    checkperiod: 600, // Check for expired keys every 10 minutes
    useClones: false // Better performance
});

/**
 * Cache middleware for GET requests
 * @param {number} duration - Cache duration in seconds
 */
export const cacheMiddleware = (duration = 3600) => {
    return (req, res, next) => {
        // Only cache GET requests
        if (req.method !== 'GET') {
            return next();
        }

        const key = `__express__${req.originalUrl || req.url}`;
        const cachedResponse = cache.get(key);

        if (cachedResponse) {
            console.log(`✅ Cache HIT: ${key}`);
            return res.json(cachedResponse);
        }

        console.log(`❌ Cache MISS: ${key}`);

        // Store original res.json
        const originalJson = res.json.bind(res);

        // Override res.json to cache the response
        res.json = (body) => {
            cache.set(key, body, duration);
            return originalJson(body);
        };

        next();
    };
};

/**
 * Clear cache for a specific pattern
 */
export const clearCache = (pattern) => {
    const keys = cache.keys();
    const matchingKeys = keys.filter(key => key.includes(pattern));
    matchingKeys.forEach(key => cache.del(key));
    console.log(`🗑️ Cleared ${matchingKeys.length} cache entries matching: ${pattern}`);
};

/**
 * Clear all cache
 */
export const clearAllCache = () => {
    cache.flushAll();
    console.log('🗑️ All cache cleared');
};

export default cache;
