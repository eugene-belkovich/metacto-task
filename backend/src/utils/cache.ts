import { ICache } from '../interfaces/cache.interface';
import { NodeCacheAdapter } from './node-cache.adapter';
import { env } from '../config';

export type CacheType = 'node-cache' | 'redis';

export function createCache(type: CacheType = 'node-cache'): ICache {
  switch (type) {
    case 'node-cache':
      return new NodeCacheAdapter({
        stdTTL: env.CACHE_TTL_SECONDS,
        checkperiod: 120,
        useClones: true,
      });
    case 'redis':
      // When Redis is needed, implement RedisAdapter and use it here
      // return new RedisAdapter();
      throw new Error('Redis cache is not yet implemented. Use node-cache instead.');
    default:
      return new NodeCacheAdapter({
        stdTTL: env.CACHE_TTL_SECONDS,
      });
  }
}

// Cache key generators for consistent key naming
export const CacheKeys = {
  featuresList: (filter: string, page: number, limit: number, sort: string) =>
    `features:list:${filter}:${page}:${limit}:${sort}`,
  featureById: (id: string) => `features:${id}`,
  voteStats: (featureId: string) => `votes:stats:${featureId}`,
  featuresPattern: 'features:*',
  votesPattern: 'votes:*',
};

// Cache TTL values in seconds
export const CacheTTL = {
  FEATURES_LIST: 60, // 60 seconds
  FEATURE_BY_ID: 30, // 30 seconds
  VOTE_STATS: 10, // 10 seconds
};
