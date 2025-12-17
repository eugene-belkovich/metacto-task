import { injectable } from 'inversify';
import { ICache } from '../interfaces/cache.interface';

// No-op cache adapter that does nothing (used when caching is disabled)
@injectable()
export class NoOpCacheAdapter implements ICache {
  async get<T>(_key: string): Promise<T | undefined> {
    return undefined;
  }

  async set<T>(_key: string, _value: T, _ttlSeconds?: number): Promise<boolean> {
    return true;
  }

  async del(_key: string | string[]): Promise<number> {
    return 0;
  }

  async flush(): Promise<void> {
    // No-op
  }

  async has(_key: string): Promise<boolean> {
    return false;
  }

  async keys(): Promise<string[]> {
    return [];
  }
}
