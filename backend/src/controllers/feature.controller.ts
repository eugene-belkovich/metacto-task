import { injectable, inject } from 'inversify';
import { FastifyRequest, FastifyReply } from 'fastify';
import { TYPES } from '../types/di.types';
import { IFeatureService } from '../services/feature.service';
import {
  CreateFeatureBody,
  ListFeaturesQuery,
  UpdateStatusBody,
  FeatureParams,
} from '../schemas/feature.schema';
import { UnauthorizedError } from '../errors';
import { CacheTTL } from '../utils/cache';

export interface IFeatureController {
  create(
    request: FastifyRequest<{ Body: CreateFeatureBody }>,
    reply: FastifyReply
  ): Promise<void>;
  list(
    request: FastifyRequest<{ Querystring: ListFeaturesQuery }>,
    reply: FastifyReply
  ): Promise<void>;
  getById(
    request: FastifyRequest<{ Params: FeatureParams }>,
    reply: FastifyReply
  ): Promise<void>;
  updateStatus(
    request: FastifyRequest<{ Params: FeatureParams; Body: UpdateStatusBody }>,
    reply: FastifyReply
  ): Promise<void>;
  delete(
    request: FastifyRequest<{ Params: FeatureParams }>,
    reply: FastifyReply
  ): Promise<void>;
}

@injectable()
export class FeatureController implements IFeatureController {
  constructor(
    @inject(TYPES.FeatureService) private featureService: IFeatureService
  ) {}

  async create(
    request: FastifyRequest<{ Body: CreateFeatureBody }>,
    reply: FastifyReply
  ): Promise<void> {
    if (!request.user) {
      throw new UnauthorizedError('User not authenticated');
    }

    const { title, description } = request.body;
    const feature = await this.featureService.create({
      title,
      description,
      authorId: request.user.userId,
    });

    reply.status(201).send(feature);
  }

  async list(
    request: FastifyRequest<{ Querystring: ListFeaturesQuery }>,
    reply: FastifyReply
  ): Promise<void> {
    const { sort, status, page = 1, limit = 10 } = request.query;

    const result = await this.featureService.findAll(
      { status },
      { page, limit, sortBy: sort }
    );

    reply
      .header('Cache-Control', `public, max-age=${CacheTTL.FEATURES_LIST}`)
      .status(200)
      .send(result);
  }

  async getById(
    request: FastifyRequest<{ Params: FeatureParams }>,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params;
    const feature = await this.featureService.findById(id);

    reply
      .header('Cache-Control', `public, max-age=${CacheTTL.FEATURE_BY_ID}`)
      .status(200)
      .send(feature);
  }

  async updateStatus(
    request: FastifyRequest<{ Params: FeatureParams; Body: UpdateStatusBody }>,
    reply: FastifyReply
  ): Promise<void> {
    if (!request.user) {
      throw new UnauthorizedError('User not authenticated');
    }

    const { id } = request.params;
    const { status } = request.body;

    const feature = await this.featureService.updateStatus(
      id,
      status,
      request.user.userId
    );

    reply.status(200).send(feature);
  }

  async delete(
    request: FastifyRequest<{ Params: FeatureParams }>,
    reply: FastifyReply
  ): Promise<void> {
    if (!request.user) {
      throw new UnauthorizedError('User not authenticated');
    }

    const { id } = request.params;
    await this.featureService.delete(id, request.user.userId);

    reply.status(200).send({ success: true });
  }
}
