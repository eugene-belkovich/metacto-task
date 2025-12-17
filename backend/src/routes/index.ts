import { FastifyInstance } from 'fastify';
import { authRoutes } from './auth.routes';
import { userRoutes } from './user.routes';
import { featureRoutes } from './feature.routes';
import { voteRoutes } from './vote.routes';

export const registerRoutes = async (fastify: FastifyInstance): Promise<void> => {
  await fastify.register(authRoutes, { prefix: '/api/auth' });
  await fastify.register(userRoutes, { prefix: '/api/users' });
  await fastify.register(featureRoutes, { prefix: '/api/features' });
  // Vote routes are mounted under /api/features since they use :id/vote pattern
  await fastify.register(voteRoutes, { prefix: '/api/features' });
};
