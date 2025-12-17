import { FastifyInstance } from 'fastify';
import { container } from '../di-container';
import { TYPES } from '../types/di.types';
import { IFeatureController } from '../controllers/feature.controller';
import {
  createFeatureSchema,
  listFeaturesSchema,
  getFeatureSchema,
  updateStatusSchema,
  deleteFeatureSchema,
  CreateFeatureBody,
  ListFeaturesQuery,
  FeatureParams,
  UpdateStatusBody,
} from '../schemas/feature.schema';
import { jwtAuthGuard } from '../guards/jwt-auth.guard';

export const featureRoutes = async (fastify: FastifyInstance): Promise<void> => {
  const featureController = container.get<IFeatureController>(TYPES.FeatureController);

  fastify.post<{ Body: CreateFeatureBody }>(
    '/',
    {
      schema: createFeatureSchema,
      preHandler: jwtAuthGuard,
    },
    async (request, reply) => {
      return featureController.create(request, reply);
    }
  );

  fastify.get<{ Querystring: ListFeaturesQuery }>(
    '/',
    {
      schema: listFeaturesSchema,
    },
    async (request, reply) => {
      return featureController.list(request, reply);
    }
  );

  fastify.get<{ Params: FeatureParams }>(
    '/:id',
    {
      schema: getFeatureSchema,
    },
    async (request, reply) => {
      return featureController.getById(request, reply);
    }
  );

  fastify.patch<{ Params: FeatureParams; Body: UpdateStatusBody }>(
    '/:id/status',
    {
      schema: updateStatusSchema,
      preHandler: jwtAuthGuard,
    },
    async (request, reply) => {
      return featureController.updateStatus(request, reply);
    }
  );

  fastify.delete<{ Params: FeatureParams }>(
    '/:id',
    {
      schema: deleteFeatureSchema,
      preHandler: jwtAuthGuard,
    },
    async (request, reply) => {
      return featureController.delete(request, reply);
    }
  );
};
