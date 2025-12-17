import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { env } from '../config';
import { UnauthorizedError } from '../errors';

export interface TokenPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: TokenPayload;
  }
}

export const jwtAuthGuard = async (
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<void> => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new UnauthorizedError('Authorization header is missing');
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw new UnauthorizedError('Invalid authorization format. Use: Bearer <token>');
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    request.user = decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid token');
    }
    throw new UnauthorizedError('Token verification failed');
  }
};

// Optional auth guard - doesn't throw if no token, but sets user if valid token exists
export const optionalAuthGuard = async (
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<void> => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return;
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
    request.user = decoded;
  } catch {
    // Silently ignore invalid tokens for optional auth
  }
};
