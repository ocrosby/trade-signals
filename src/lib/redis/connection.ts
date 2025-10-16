import Redis from 'ioredis';

const globalForRedis = globalThis as unknown as {
    redis: Redis | undefined;
};

// Redis connection configuration
const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    retryDelayOnFailover: 100,
    enableReadyCheck: false,
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    keepAlive: 30000,
    connectTimeout: 10000,
    commandTimeout: 5000,
    retryDelayOnClusterDown: 300,
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    db: 0, // Use database 0 for application data
};

// Main Redis client for caching and general operations
export const redis = globalForRedis.redis ?? new Redis({
    ...redisConfig,
    db: 0,
});

// Separate Redis client for pub/sub operations
export const redisPubSub = new Redis({
    ...redisConfig,
    db: 1,
});

// Redis client for real-time data (separate database)
export const redisRealTime = new Redis({
    ...redisConfig,
    db: 2,
});

// Redis client for session storage
export const redisSessions = new Redis({
    ...redisConfig,
    db: 3,
});

if (process.env.NODE_ENV !== 'production') {
    globalForRedis.redis = redis;
}

// Redis connection health check
export async function checkRedisConnection(): Promise<boolean> {
    try {
        await redis.ping();
        return true;
    } catch (error) {
        console.error('Redis connection failed:', error);
        return false;
    }
}

// Graceful shutdown
export async function disconnectRedis(): Promise<void> {
    await Promise.all([
        redis.disconnect(),
        redisPubSub.disconnect(),
        redisRealTime.disconnect(),
        redisSessions.disconnect(),
    ]);
}

// Cache key generators
export const CacheKeys = {
    // Price data cache keys
    priceData: (symbol: string, interval: string, limit?: number) =>
        `price:${symbol}:${interval}${limit ? `:${limit}` : ''}`,

    // Indicator cache keys
    indicator: (symbol: string, type: string, period: number, interval: string) =>
        `indicator:${symbol}:${type}:${period}:${interval}`,

    // Signal cache keys
    signals: (symbol: string, type?: string, limit?: number) =>
        `signals:${symbol}${type ? `:${type}` : ''}${limit ? `:${limit}` : ''}`,

    // Asset cache keys
    asset: (symbol: string) => `asset:${symbol}`,
    assets: (type?: string) => `assets${type ? `:${type}` : ''}`,

    // Real-time data cache keys
    realTimePrice: (symbol: string) => `realtime:price:${symbol}`,
    realTimeVolume: (symbol: string) => `realtime:volume:${symbol}`,

    // Session cache keys
    session: (sessionId: string) => `session:${sessionId}`,
    userSession: (userId: string) => `user:session:${userId}`,

    // API rate limiting keys
    rateLimit: (ip: string, endpoint: string) => `rate:${ip}:${endpoint}`,

    // Background job keys
    job: (jobId: string) => `job:${jobId}`,
    jobQueue: (queueName: string) => `queue:${queueName}`,
};

// Cache TTL constants
export const CacheTTL = {
    PRICE_DATA: parseInt(process.env.CACHE_TTL || '3600'), // 1 hour
    INDICATORS: parseInt(process.env.CACHE_TTL || '3600'), // 1 hour
    SIGNALS: parseInt(process.env.CACHE_TTL || '3600'), // 1 hour
    ASSETS: 86400, // 24 hours
    REAL_TIME: parseInt(process.env.REAL_TIME_CACHE_TTL || '60'), // 1 minute
    SESSION: 86400, // 24 hours
    RATE_LIMIT: parseInt(process.env.RATE_LIMIT_WINDOW || '900000') / 1000, // 15 minutes
};

// Redis utility functions
export class RedisUtils {
    // Generic cache get with JSON parsing
    static async get<T>(key: string): Promise<T | null> {
        try {
            const value = await redis.get(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error(`Redis GET error for key ${key}:`, error);
            return null;
        }
    }

    // Generic cache set with JSON stringify
    static async set(key: string, value: any, ttl?: number): Promise<boolean> {
        try {
            const serialized = JSON.stringify(value);
            if (ttl) {
                await redis.setex(key, ttl, serialized);
            } else {
                await redis.set(key, serialized);
            }
            return true;
        } catch (error) {
            console.error(`Redis SET error for key ${key}:`, error);
            return false;
        }
    }

    // Delete key
    static async del(key: string): Promise<boolean> {
        try {
            const result = await redis.del(key);
            return result > 0;
        } catch (error) {
            console.error(`Redis DEL error for key ${key}:`, error);
            return false;
        }
    }

    // Delete multiple keys
    static async delMultiple(keys: string[]): Promise<number> {
        try {
            return await redis.del(...keys);
        } catch (error) {
            console.error(`Redis DEL multiple error for keys ${keys}:`, error);
            return 0;
        }
    }

    // Check if key exists
    static async exists(key: string): Promise<boolean> {
        try {
            const result = await redis.exists(key);
            return result === 1;
        } catch (error) {
            console.error(`Redis EXISTS error for key ${key}:`, error);
            return false;
        }
    }

    // Set expiration for existing key
    static async expire(key: string, ttl: number): Promise<boolean> {
        try {
            const result = await redis.expire(key, ttl);
            return result === 1;
        } catch (error) {
            console.error(`Redis EXPIRE error for key ${key}:`, error);
            return false;
        }
    }

    // Get TTL for key
    static async ttl(key: string): Promise<number> {
        try {
            return await redis.ttl(key);
        } catch (error) {
            console.error(`Redis TTL error for key ${key}:`, error);
            return -1;
        }
    }

    // Increment counter
    static async incr(key: string): Promise<number> {
        try {
            return await redis.incr(key);
        } catch (error) {
            console.error(`Redis INCR error for key ${key}:`, error);
            return 0;
        }
    }

    // Increment counter with expiration
    static async incrEx(key: string, ttl: number): Promise<number> {
        try {
            const result = await redis.incr(key);
            if (result === 1) {
                await redis.expire(key, ttl);
            }
            return result;
        } catch (error) {
            console.error(`Redis INCR EX error for key ${key}:`, error);
            return 0;
        }
    }

    // List operations
    static async lpush(key: string, ...values: any[]): Promise<number> {
        try {
            const serialized = values.map(v => JSON.stringify(v));
            return await redis.lpush(key, ...serialized);
        } catch (error) {
            console.error(`Redis LPUSH error for key ${key}:`, error);
            return 0;
        }
    }

    static async rpop<T>(key: string): Promise<T | null> {
        try {
            const value = await redis.rpop(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error(`Redis RPOP error for key ${key}:`, error);
            return null;
        }
    }

    static async llen(key: string): Promise<number> {
        try {
            return await redis.llen(key);
        } catch (error) {
            console.error(`Redis LLEN error for key ${key}:`, error);
            return 0;
        }
    }

    // Hash operations
    static async hset(key: string, field: string, value: any): Promise<boolean> {
        try {
            const serialized = JSON.stringify(value);
            const result = await redis.hset(key, field, serialized);
            return result >= 0;
        } catch (error) {
            console.error(`Redis HSET error for key ${key}, field ${field}:`, error);
            return false;
        }
    }

    static async hget<T>(key: string, field: string): Promise<T | null> {
        try {
            const value = await redis.hget(key, field);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error(`Redis HGET error for key ${key}, field ${field}:`, error);
            return null;
        }
    }

    static async hdel(key: string, ...fields: string[]): Promise<number> {
        try {
            return await redis.hdel(key, ...fields);
        } catch (error) {
            console.error(`Redis HDEL error for key ${key}, fields ${fields}:`, error);
            return 0;
        }
    }

    // Set operations
    static async sadd(key: string, ...members: string[]): Promise<number> {
        try {
            return await redis.sadd(key, ...members);
        } catch (error) {
            console.error(`Redis SADD error for key ${key}:`, error);
            return 0;
        }
    }

    static async srem(key: string, ...members: string[]): Promise<number> {
        try {
            return await redis.srem(key, ...members);
        } catch (error) {
            console.error(`Redis SREM error for key ${key}:`, error);
            return 0;
        }
    }

    static async smembers(key: string): Promise<string[]> {
        try {
            return await redis.smembers(key);
        } catch (error) {
            console.error(`Redis SMEMBERS error for key ${key}:`, error);
            return [];
        }
    }

    // Pattern-based key operations
    static async keys(pattern: string): Promise<string[]> {
        try {
            return await redis.keys(pattern);
        } catch (error) {
            console.error(`Redis KEYS error for pattern ${pattern}:`, error);
            return [];
        }
    }

    // Flush database
    static async flushdb(): Promise<boolean> {
        try {
            await redis.flushdb();
            return true;
        } catch (error) {
            console.error('Redis FLUSHDB error:', error);
            return false;
        }
    }

    // Get Redis info
    static async info(): Promise<string> {
        try {
            return await redis.info();
        } catch (error) {
            console.error('Redis INFO error:', error);
            return '';
        }
    }
}

export default redis;
