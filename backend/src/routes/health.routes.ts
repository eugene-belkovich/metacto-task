import { FastifyInstance } from 'fastify';
import { container } from '../di-container';
import { TYPES } from '../types/di.types';
import { IHealthController } from '../controllers/health.controller';

export const healthRoutes = async (fastify: FastifyInstance): Promise<void> => {
  const healthController = container.get<IHealthController>(TYPES.HealthController);

  fastify.get(
    '/',
    {
      schema: {
        description: 'Basic health check',
        tags: ['Health'],
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok', 'error'] },
              timestamp: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      return healthController.health(request, reply);
    }
  );

  fastify.get(
    '/ready',
    {
      schema: {
        description: 'Readiness check verifying database and cache',
        tags: ['Health'],
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok', 'error'] },
              timestamp: { type: 'string', format: 'date-time' },
              checks: {
                type: 'object',
                properties: {
                  database: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', enum: ['ok', 'error'] },
                      message: { type: 'string' },
                    },
                  },
                  cache: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', enum: ['ok', 'error'] },
                      message: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
          503: {
            type: 'object',
            properties: {
              status: { type: 'string', enum: ['ok', 'error'] },
              timestamp: { type: 'string', format: 'date-time' },
              checks: {
                type: 'object',
                properties: {
                  database: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', enum: ['ok', 'error'] },
                      message: { type: 'string' },
                    },
                  },
                  cache: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', enum: ['ok', 'error'] },
                      message: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      return healthController.ready(request, reply);
    }
  );
};
