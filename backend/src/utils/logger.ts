import pino from 'pino';
import { env } from '../config/env';

const getLogLevel = (): string => {
  if (env.LOG_LEVEL) return env.LOG_LEVEL;
  return env.NODE_ENV === 'development' ? 'debug' : 'info';
};

const SENSITIVE_KEYS = ['password', 'token', 'authorization', 'secret', 'apikey', 'api_key'];

export const maskSensitiveData = (obj: unknown): unknown => {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    // Mask JWT tokens
    if (obj.startsWith('Bearer ') || obj.match(/^eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+/)) {
      return '[REDACTED]';
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(maskSensitiveData);
  }

  if (typeof obj === 'object') {
    const masked: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      const lowerKey = key.toLowerCase();
      if (SENSITIVE_KEYS.some((sensitive) => lowerKey.includes(sensitive))) {
        masked[key] = '[REDACTED]';
      } else {
        masked[key] = maskSensitiveData(value);
      }
    }
    return masked;
  }

  return obj;
};

const pinoLogger = pino({
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
});

const formatArgs = (...args: unknown[]): string => {
  return args
    .map((arg) => {
      if (arg instanceof Error) {
        return `${arg.message}\n${arg.stack}`;
      }
      const masked = maskSensitiveData(arg);
      return typeof masked === 'object' ? JSON.stringify(masked) : String(masked);
    })
    .join(' ');
};

const logger = {
  info: (...args: unknown[]) => pinoLogger.info(formatArgs(...args)),
  warn: (...args: unknown[]) => pinoLogger.warn(formatArgs(...args)),
  error: (...args: unknown[]) => pinoLogger.error(formatArgs(...args)),
  debug: (...args: unknown[]) => pinoLogger.debug(formatArgs(...args)),
  fatal: (...args: unknown[]) => pinoLogger.fatal(formatArgs(...args)),
  trace: (...args: unknown[]) => pinoLogger.trace(formatArgs(...args)),
  // Expose the raw pino logger for Fastify integration
  pino: pinoLogger,
};

console.log = logger.info;
console.info = logger.info;
console.warn = logger.warn;
console.debug = logger.debug;
console.error = logger.error;

export default logger;
export { logger };
