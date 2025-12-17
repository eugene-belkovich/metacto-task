import 'reflect-metadata';
import Fastify, { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { env, connectDatabase } from './config';
import { logger } from './utils/logger';
import { AppError } from './errors';

// Error response format - Task 41
interface ErrorResponse {
  statusCode: number;
  error: string;
  message: string;
  details?: Record<string, unknown>;
}

const buildServer = async () => {
  const server = Fastify({
    logger: {
      level: env.LOG_LEVEL,
      transport:
        env.NODE_ENV === 'development'
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
              },
            }
          : undefined,
    },
  });

  // Register plugins
  await server.register(cors, {
    origin: env.CORS_ORIGIN,
    credentials: true,
  });

  await server.register(helmet, {
    contentSecurityPolicy: false,
  });

  await server.register(rateLimit, {
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_WINDOW_MS,
  });

  // Global error handler - Task 40
  server.setErrorHandler(
    (error: FastifyError | AppError, _request: FastifyRequest, reply: FastifyReply) => {
      const response: ErrorResponse = {
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
      };

      // Handle our custom AppError
      if (error instanceof AppError) {
        response.statusCode = error.statusCode;
        response.error = error.error;
        response.message = error.message;
        if (error.details) {
          response.details = error.details;
        }
      }
      // Handle Fastify validation errors
      else if (error.validation) {
        response.statusCode = 400;
        response.error = 'Bad Request';
        response.message = 'Validation failed';
        response.details = { validation: error.validation };
      }
      // Handle other Fastify errors
      else if (error.statusCode) {
        response.statusCode = error.statusCode;
        response.error = error.name || 'Error';
        response.message = error.message;
      }

      // Log server errors
      if (response.statusCode >= 500) {
        server.log.error({ err: error }, 'Server error');
      } else {
        server.log.warn({ err: error }, 'Client error');
      }

      return reply.status(response.statusCode).send(response);
    }
  );

  return server;
};

const start = async () => {
  try {
    // Connect to database
    await connectDatabase();

    const server = await buildServer();

    await server.listen({
      port: env.PORT,
      host: env.HOST,
    });

    logger.info(`Server is running on http://${env.HOST}:${env.PORT}`);
  } catch (err) {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  }
};

start();

export { buildServer };
