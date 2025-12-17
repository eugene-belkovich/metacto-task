import { FastifyInstance } from 'fastify';
import { container } from '../di-container';
import { TYPES } from '../types/di.types';
import { IVoteController } from '../controllers/vote.controller';
import {
  voteSchema,
  removeVoteSchema,
  getVoteStatsSchema,
  VoteParams,
  VoteBody,
} from '../schemas/vote.schema';
import { jwtAuthGuard } from '../guards/jwt-auth.guard';

export const voteRoutes = async (fastify: FastifyInstance): Promise<void> => {
  const voteController = container.get<IVoteController>(TYPES.VoteController);

  fastify.post<{ Params: VoteParams; Body: VoteBody }>(
    '/:id/vote',
    {
      schema: voteSchema,
      preHandler: jwtAuthGuard,
    },
    async (request, reply) => {
      return voteController.vote(request, reply);
    }
  );

  fastify.delete<{ Params: VoteParams }>(
    '/:id/vote',
    {
      schema: removeVoteSchema,
      preHandler: jwtAuthGuard,
    },
    async (request, reply) => {
      return voteController.removeVote(request, reply);
    }
  );

  fastify.get<{ Params: VoteParams }>(
    '/:id/votes',
    {
      schema: getVoteStatsSchema,
    },
    async (request, reply) => {
      return voteController.getStats(request, reply);
    }
  );
};
