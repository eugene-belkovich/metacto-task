import { FastifyInstance } from 'fastify';
import { container } from '../di-container';
import { TYPES } from '../types/di.types';
import { IAuthController } from '../controllers/auth.controller';
import { registerSchema, loginSchema } from '../schemas/auth.schema';

export const authRoutes = async (fastify: FastifyInstance): Promise<void> => {
  const authController = container.get<IAuthController>(TYPES.AuthController);

  // Task 59: Register POST /api/auth/register endpoint
  fastify.post(
    '/register',
    { schema: registerSchema },
    authController.register.bind(authController)
  );

  // Task 60: Register POST /api/auth/login endpoint
  fastify.post(
    '/login',
    { schema: loginSchema },
    authController.login.bind(authController)
  );
};
