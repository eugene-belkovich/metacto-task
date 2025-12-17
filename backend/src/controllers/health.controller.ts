import { injectable, inject } from 'inversify';
import { FastifyRequest, FastifyReply } from 'fastify';
import mongoose from 'mongoose';
import { TYPES } from '../types/di.types';
import { ICache } from '../interfaces/cache.interface';

export interface HealthStatus {
  status: 'ok' | 'error';
  timestamp: string;
}

export interface ReadinessStatus {
  status: 'ok' | 'error';
  timestamp: string;
  checks: {
    database: {
      status: 'ok' | 'error';
      message?: string;
    };
    cache: {
      status: 'ok' | 'error';
      message?: string;
    };
  };
}

export interface IHealthController {
  health(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  ready(request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

@injectable()
export class HealthController implements IHealthController {
  constructor(@inject(TYPES.Cache) private cache: ICache) {}

  async health(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const response: HealthStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };

    reply.status(200).send(response);
  }

  async ready(_request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const checks = {
      database: await this.checkDatabase(),
      cache: await this.checkCache(),
    };

    const allHealthy = checks.database.status === 'ok' && checks.cache.status === 'ok';

    const response: ReadinessStatus = {
      status: allHealthy ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      checks,
    };

    reply.status(allHealthy ? 200 : 503).send(response);
  }

  private async checkDatabase(): Promise<{ status: 'ok' | 'error'; message?: string }> {
    try {
      // mongoose.connection.readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
      const state = mongoose.connection.readyState;

      if (state === 1) {
        // Ping the database to verify it's responsive
        await mongoose.connection.db?.admin().ping();
        return { status: 'ok' };
      }

      return {
        status: 'error',
        message: `Database not connected (state: ${state})`,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Database check failed',
      };
    }
  }

  private async checkCache(): Promise<{ status: 'ok' | 'error'; message?: string }> {
    try {
      // Try to set and get a test value
      const testKey = '__health_check__';
      const testValue = Date.now();

      await this.cache.set(testKey, testValue, 10);
      const retrieved = await this.cache.get<number>(testKey);
      await this.cache.del(testKey);

      if (retrieved === testValue) {
        return { status: 'ok' };
      }

      return {
        status: 'error',
        message: 'Cache read/write verification failed',
      };
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Cache check failed',
      };
    }
  }
}
