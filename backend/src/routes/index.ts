import { FastifyInstance } from 'fastify';
import { authRoutes } from './auth.routes';

export const registerRoutes = async (fastify: FastifyInstance): Promise<void> => {
  await fastify.register(authRoutes, { prefix: '/api/auth' });
};
