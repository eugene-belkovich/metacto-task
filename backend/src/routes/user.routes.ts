import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { container } from '../di-container';
import { TYPES } from '../types/di.types';
import { IUserController } from '../controllers/user.controller';
import { getMeSchema, getByIdSchema, UserParams } from '../schemas/user.schema';
import { jwtAuthGuard } from '../guards/jwt-auth.guard';

export const userRoutes = async (fastify: FastifyInstance): Promise<void> => {
  const userController = container.get<IUserController>(TYPES.UserController);

  fastify.get(
    '/me',
    {
      schema: getMeSchema,
      preHandler: jwtAuthGuard,
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return userController.getMe(request, reply);
    }
  );

  fastify.get<{ Params: UserParams }>(
    '/:id',
    {
      schema: getByIdSchema,
      preHandler: jwtAuthGuard,
    },
    async (request, reply) => {
      return userController.getById(request, reply);
    }
  );
};
