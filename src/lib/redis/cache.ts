import { Asset, Indicator, PriceData, Signal } from '@prisma/client';
import { CacheKeys, CacheTTL, RedisUtils } from './connection';

// Cache service for price data
export class PriceDataCache {
    // Get cached price data
    static async get(symbol: string, interval: string, limit?: number): Promise<PriceData[] | null> {
        const key = CacheKeys.priceData(symbol, interval, limit);
        return await RedisUtils.get<PriceData[]>(key);
    }

    // Set price data cache
    static async set(symbol: string, interval: string, data: PriceData[], limit?: number): Promise<boolean> {
        const key = CacheKeys.priceData(symbol, interval, limit);
        return await RedisUtils.set(key, data, CacheTTL.PRICE_DATA);
    }

    // Invalidate price data cache
    static async invalidate(symbol: string, interval?: string): Promise<boolean> {
        try {
            const pattern = interval
                ? `price:${symbol}:${interval}*`
                : `price:${symbol}:*`;

            const keys = await RedisUtils.keys(pattern);
            if (keys.length > 0) {
                await RedisUtils.delMultiple(keys);
            }
            return true;
        } catch (error) {
            console.error('Failed to invalidate price data cache:', error);
            return false;
        }
    }

    // Get real-time price
    static async getRealTime(symbol: string): Promise<PriceData | null> {
        const key = CacheKeys.realTimePrice(symbol);
        return await RedisUtils.get<PriceData>(key);
    }

    // Set real-time price
    static async setRealTime(symbol: string, data: PriceData): Promise<boolean> {
        const key = CacheKeys.realTimePrice(symbol);
        return await RedisUtils.set(key, data, CacheTTL.REAL_TIME);
    }
}

// Cache service for indicators
export class IndicatorCache {
    // Get cached indicator data
    static async get(symbol: string, type: string, period: number, interval: string): Promise<Indicator[] | null> {
        const key = CacheKeys.indicator(symbol, type, period, interval);
        return await RedisUtils.get<Indicator[]>(key);
    }

    // Set indicator cache
    static async set(symbol: string, type: string, period: number, interval: string, data: Indicator[]): Promise<boolean> {
        const key = CacheKeys.indicator(symbol, type, period, interval);
        return await RedisUtils.set(key, data, CacheTTL.INDICATORS);
    }

    // Invalidate indicator cache
    static async invalidate(symbol: string, type?: string): Promise<boolean> {
        try {
            const pattern = type
                ? `indicator:${symbol}:${type}:*`
                : `indicator:${symbol}:*`;

            const keys = await RedisUtils.keys(pattern);
            if (keys.length > 0) {
                await RedisUtils.delMultiple(keys);
            }
            return true;
        } catch (error) {
            console.error('Failed to invalidate indicator cache:', error);
            return false;
        }
    }
}

// Cache service for signals
export class SignalCache {
    // Get cached signals
    static async get(symbol: string, type?: string, limit?: number): Promise<Signal[] | null> {
        const key = CacheKeys.signals(symbol, type, limit);
        return await RedisUtils.get<Signal[]>(key);
    }

    // Set signals cache
    static async set(symbol: string, data: Signal[], type?: string, limit?: number): Promise<boolean> {
        const key = CacheKeys.signals(symbol, type, limit);
        return await RedisUtils.set(key, data, CacheTTL.SIGNALS);
    }

    // Invalidate signals cache
    static async invalidate(symbol: string, type?: string): Promise<boolean> {
        try {
            const pattern = type
                ? `signals:${symbol}:${type}*`
                : `signals:${symbol}*`;

            const keys = await RedisUtils.keys(pattern);
            if (keys.length > 0) {
                await RedisUtils.delMultiple(keys);
            }
            return true;
        } catch (error) {
            console.error('Failed to invalidate signals cache:', error);
            return false;
        }
    }

    // Get latest signal for symbol
    static async getLatest(symbol: string): Promise<Signal | null> {
        const key = CacheKeys.signals(symbol, undefined, 1);
        const signals = await RedisUtils.get<Signal[]>(key);
        return signals && signals.length > 0 ? signals[0] : null;
    }

    // Set latest signal
    static async setLatest(symbol: string, signal: Signal): Promise<boolean> {
        const key = CacheKeys.signals(symbol, undefined, 1);
        return await RedisUtils.set(key, [signal], CacheTTL.SIGNALS);
    }
}

// Cache service for assets
export class AssetCache {
    // Get cached asset
    static async get(symbol: string): Promise<Asset | null> {
        const key = CacheKeys.asset(symbol);
        return await RedisUtils.get<Asset>(key);
    }

    // Set asset cache
    static async set(symbol: string, asset: Asset): Promise<boolean> {
        const key = CacheKeys.asset(symbol);
        return await RedisUtils.set(key, asset, CacheTTL.ASSETS);
    }

    // Get all assets by type
    static async getByType(type: string): Promise<Asset[] | null> {
        const key = CacheKeys.assets(type);
        return await RedisUtils.get<Asset[]>(key);
    }

    // Set assets by type
    static async setByType(type: string, assets: Asset[]): Promise<boolean> {
        const key = CacheKeys.assets(type);
        return await RedisUtils.set(key, assets, CacheTTL.ASSETS);
    }

    // Invalidate asset cache
    static async invalidate(symbol?: string): Promise<boolean> {
        try {
            if (symbol) {
                const key = CacheKeys.asset(symbol);
                await RedisUtils.del(key);
            } else {
                const keys = await RedisUtils.keys('asset:*');
                if (keys.length > 0) {
                    await RedisUtils.delMultiple(keys);
                }
            }
            return true;
        } catch (error) {
            console.error('Failed to invalidate asset cache:', error);
            return false;
        }
    }
}

// Rate limiting cache service
export class RateLimitCache {
    // Check rate limit
    static async checkLimit(ip: string, endpoint: string, maxRequests: number, windowMs: number): Promise<{
        allowed: boolean;
        remaining: number;
        resetTime: number;
    }> {
        const key = CacheKeys.rateLimit(ip, endpoint);
        const current = await RedisUtils.incrEx(key, Math.floor(windowMs / 1000));

        return {
            allowed: current <= maxRequests,
            remaining: Math.max(0, maxRequests - current),
            resetTime: Date.now() + windowMs,
        };
    }

    // Get rate limit info
    static async getLimitInfo(ip: string, endpoint: string): Promise<{
        current: number;
        ttl: number;
    }> {
        const key = CacheKeys.rateLimit(ip, endpoint);
        const current = await RedisUtils.get<number>(key) || 0;
        const ttl = await RedisUtils.ttl(key);

        return {
            current,
            ttl: ttl > 0 ? ttl * 1000 : 0, // Convert to milliseconds
        };
    }
}

// Background job cache service
export class JobCache {
    // Set job status
    static async setStatus(jobId: string, status: string, data?: any): Promise<boolean> {
        const key = CacheKeys.job(jobId);
        const jobData = {
            id: jobId,
            status,
            data,
            timestamp: new Date().toISOString(),
        };
        return await RedisUtils.set(key, jobData, 86400); // 24 hours
    }

    // Get job status
    static async getStatus(jobId: string): Promise<any> {
        const key = CacheKeys.job(jobId);
        return await RedisUtils.get(key);
    }

    // Add job to queue
    static async enqueue(queueName: string, jobData: any): Promise<boolean> {
        const key = CacheKeys.jobQueue(queueName);
        return (await RedisUtils.lpush(key, jobData)) > 0;
    }

    // Get job from queue
    static async dequeue(queueName: string): Promise<any> {
        const key = CacheKeys.jobQueue(queueName);
        return await RedisUtils.rpop(key);
    }

    // Get queue length
    static async getQueueLength(queueName: string): Promise<number> {
        const key = CacheKeys.jobQueue(queueName);
        return await RedisUtils.llen(key);
    }
}

// Session cache service
export class SessionCache {
    // Set session data
    static async set(sessionId: string, data: any): Promise<boolean> {
        const key = CacheKeys.session(sessionId);
        return await RedisUtils.set(key, data, CacheTTL.SESSION);
    }

    // Get session data
    static async get(sessionId: string): Promise<any> {
        const key = CacheKeys.session(sessionId);
        return await RedisUtils.get(key);
    }

    // Delete session
    static async delete(sessionId: string): Promise<boolean> {
        const key = CacheKeys.session(sessionId);
        return await RedisUtils.del(key);
    }

    // Set user session
    static async setUserSession(userId: string, sessionId: string): Promise<boolean> {
        const key = CacheKeys.userSession(userId);
        return await RedisUtils.set(key, sessionId, CacheTTL.SESSION);
    }

    // Get user session
    static async getUserSession(userId: string): Promise<string | null> {
        const key = CacheKeys.userSession(userId);
        return await RedisUtils.get<string>(key);
    }
}

// Cache warming service
export class CacheWarmer {
    // Warm price data cache
    static async warmPriceData(symbols: string[], intervals: string[]): Promise<void> {
        console.log(`Warming price data cache for ${symbols.length} symbols and ${intervals.length} intervals`);

        for (const symbol of symbols) {
            for (const interval of intervals) {
                try {
                    // Check if cache exists
                    const cached = await PriceDataCache.get(symbol, interval);
                    if (!cached) {
                        // Fetch from database and cache
                        // This would typically call your data service
                        console.log(`Cache miss for ${symbol}:${interval}, would fetch from database`);
                    }
                } catch (error) {
                    console.error(`Failed to warm cache for ${symbol}:${interval}:`, error);
                }
            }
        }
    }

    // Warm indicators cache
    static async warmIndicators(symbols: string[], indicatorTypes: string[]): Promise<void> {
        console.log(`Warming indicators cache for ${symbols.length} symbols and ${indicatorTypes.length} indicator types`);

        for (const symbol of symbols) {
            for (const type of indicatorTypes) {
                try {
                    const cached = await IndicatorCache.get(symbol, type, 20, '1d');
                    if (!cached) {
                        console.log(`Cache miss for indicator ${symbol}:${type}, would fetch from database`);
                    }
                } catch (error) {
                    console.error(`Failed to warm indicator cache for ${symbol}:${type}:`, error);
                }
            }
        }
    }

    // Warm signals cache
    static async warmSignals(symbols: string[]): Promise<void> {
        console.log(`Warming signals cache for ${symbols.length} symbols`);

        for (const symbol of symbols) {
            try {
                const cached = await SignalCache.get(symbol);
                if (!cached) {
                    console.log(`Cache miss for signals ${symbol}, would fetch from database`);
                }
            } catch (error) {
                console.error(`Failed to warm signals cache for ${symbol}:`, error);
            }
        }
    }
}

// Cache statistics service
export class CacheStats {
    // Get cache hit/miss statistics
    static async getStats(): Promise<{
        totalKeys: number;
        memoryUsage: string;
        hitRate: number;
        topKeys: Array<{ key: string; ttl: number; type: string }>;
    }> {
        try {
            const info = await RedisUtils.info();
            const keys = await RedisUtils.keys('*');

            // Parse Redis info for memory usage
            const memoryMatch = info.match(/used_memory_human:([^\r\n]+)/);
            const memoryUsage = memoryMatch ? memoryMatch[1].trim() : 'Unknown';

            // Get TTL for top keys
            const topKeys = await Promise.all(
                keys.slice(0, 10).map(async (key) => ({
                    key,
                    ttl: await RedisUtils.ttl(key),
                    type: key.split(':')[0],
                }))
            );

            return {
                totalKeys: keys.length,
                memoryUsage,
                hitRate: 0, // Would need to track this separately
                topKeys,
            };
        } catch (error) {
            console.error('Failed to get cache stats:', error);
            return {
                totalKeys: 0,
                memoryUsage: 'Unknown',
                hitRate: 0,
                topKeys: [],
            };
        }
    }

    // Clear all caches
    static async clearAll(): Promise<boolean> {
        try {
            await RedisUtils.flushdb();
            console.log('All caches cleared');
            return true;
        } catch (error) {
            console.error('Failed to clear caches:', error);
            return false;
        }
    }

    // Clear cache by pattern
    static async clearByPattern(pattern: string): Promise<number> {
        try {
            const keys = await RedisUtils.keys(pattern);
            if (keys.length > 0) {
                return await RedisUtils.delMultiple(keys);
            }
            return 0;
        } catch (error) {
            console.error(`Failed to clear cache by pattern ${pattern}:`, error);
            return 0;
        }
    }
}

// Export all cache services
export {
    AssetCache, CacheStats, CacheWarmer, IndicatorCache, JobCache, PriceDataCache, RateLimitCache, SessionCache, SignalCache
};

