import NodeCache from 'node-cache';
import { injectable } from 'inversify';
import { ICache, CacheOptions } from '../interfaces/cache.interface';

@injectable()
export class NodeCacheAdapter implements ICache {
  private cache: NodeCache;

  constructor(options?: CacheOptions) {
    this.cache = new NodeCache({
      stdTTL: options?.stdTTL ?? 60,
      checkperiod: options?.checkperiod ?? 120,
      useClones: options?.useClones ?? true,
    });
  }

  async get<T>(key: string): Promise<T | undefined> {
    return this.cache.get<T>(key);
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<boolean> {
    if (ttlSeconds !== undefined) {
      return this.cache.set(key, value, ttlSeconds);
    }
    return this.cache.set(key, value);
  }

  async del(key: string | string[]): Promise<number> {
    return this.cache.del(key);
  }

  async flush(): Promise<void> {
    this.cache.flushAll();
  }

  async has(key: string): Promise<boolean> {
    return this.cache.has(key);
  }

  async keys(): Promise<string[]> {
    return this.cache.keys();
  }
}
