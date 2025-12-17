import { injectable } from 'inversify';
import { ICache } from '../interfaces/cache.interface';
@injectable()
export class RedisAdapter implements ICache {
  // private client: Redis;

  constructor() {
    // Placeholder - implement with actual Redis client when needed
    // this.client = new Redis(process.env.REDIS_URL);
    throw new Error(
      'Redis adapter is not implemented. Install ioredis and implement this adapter, or use NodeCacheAdapter instead.'
    );
  }

  async get<T>(key: string): Promise<T | undefined> {
    // const value = await this.client.get(key);
    // return value ? JSON.parse(value) : undefined;
    throw new Error(`Redis get not implemented for key: ${key}`);
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<boolean> {
    // if (ttlSeconds) {
    //   await this.client.setex(key, ttlSeconds, JSON.stringify(value));
    // } else {
    //   await this.client.set(key, JSON.stringify(value));
    // }
    // return true;
    throw new Error(`Redis set not implemented for key: ${key}, value: ${value}, ttl: ${ttlSeconds}`);
  }

  async del(key: string | string[]): Promise<number> {
    // const keys = Array.isArray(key) ? key : [key];
    // return this.client.del(...keys);
    throw new Error(`Redis del not implemented for key: ${key}`);
  }

  async flush(): Promise<void> {
    // await this.client.flushdb();
    throw new Error('Redis flush not implemented');
  }

  async has(key: string): Promise<boolean> {
    // return (await this.client.exists(key)) === 1;
    throw new Error(`Redis has not implemented for key: ${key}`);
  }

  async keys(): Promise<string[]> {
    // return this.client.keys('*');
    throw new Error('Redis keys not implemented');
  }
}
