import 'reflect-metadata';
import Fastify, { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { randomUUID } from 'crypto';
import { env, connectDatabase } from './config';
import logger, { maskSensitiveData } from './utils/logger';
import { AppError } from './errors';
import { registerRoutes } from './routes';

interface ErrorResponse {
  statusCode: number;
  error: string;
  message: string;
  details?: Record<string, unknown>;
}

const getLogLevel = (): string => {
  if (env.LOG_LEVEL) return env.LOG_LEVEL;
  return env.NODE_ENV === 'development' ? 'debug' : 'info';
};

const buildServer = async () => {
  const server = Fastify({
    logger: {
      level: getLogLevel(),
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
      redact: {
        paths: [
          'req.headers.authorization',
          'req.body.password',
          'req.body.token',
          'res.headers["set-cookie"]',
        ],
        censor: '[REDACTED]',
      },
      serializers: {
        req(request) {
          return {
            method: request.method,
            url: request.url,
            headers: maskSensitiveData(request.headers),
            hostname: request.hostname,
            remoteAddress: request.ip,
          };
        },
        res(reply) {
          return {
            statusCode: reply.statusCode,
          };
        },
      },
    },
    genReqId: () => randomUUID(),
    requestIdHeader: 'x-request-id',
    requestIdLogLabel: 'requestId',
  });

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

  await registerRoutes(server);

  server.setErrorHandler(
    (error: FastifyError | AppError, request: FastifyRequest, reply: FastifyReply) => {
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

      const logContext = {
        err: error,
        requestId: request.id,
        method: request.method,
        url: request.url,
        statusCode: response.statusCode,
        // Include stack trace for server errors
        ...(response.statusCode >= 500 && error.stack ? { stack: error.stack } : {}),
      };

      if (response.statusCode >= 500) {
        server.log.error(logContext, 'Server error');
      } else {
        server.log.warn(logContext, 'Client error');
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
