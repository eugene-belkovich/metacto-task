export interface ICache {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<boolean>;
  del(key: string | string[]): Promise<number>;
  flush(): Promise<void>;
  has(key: string): Promise<boolean>;
  keys(): Promise<string[]>;
}

export interface CacheOptions {
  stdTTL?: number; // Default TTL in seconds
  checkperiod?: number; // Period in seconds for checking expired keys
  useClones?: boolean; // Whether to clone cached values
}
