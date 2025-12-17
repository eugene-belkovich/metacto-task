import { injectable, inject } from 'inversify';
import { FastifyRequest, FastifyReply } from 'fastify';
import { TYPES } from '../types/di.types';
import { IVoteService } from '../services/vote.service';
import { VoteBody, VoteParams } from '../schemas/vote.schema';
import { UnauthorizedError } from '../errors';
import { CacheTTL } from '../utils/cache';

export interface IVoteController {
  vote(
    request: FastifyRequest<{ Params: VoteParams; Body: VoteBody }>,
    reply: FastifyReply
  ): Promise<void>;
  removeVote(
    request: FastifyRequest<{ Params: VoteParams }>,
    reply: FastifyReply
  ): Promise<void>;
  getStats(
    request: FastifyRequest<{ Params: VoteParams }>,
    reply: FastifyReply
  ): Promise<void>;
}

@injectable()
export class VoteController implements IVoteController {
  constructor(
    @inject(TYPES.VoteService) private voteService: IVoteService
  ) {}

  async vote(
    request: FastifyRequest<{ Params: VoteParams; Body: VoteBody }>,
    reply: FastifyReply
  ): Promise<void> {
    if (!request.user) {
      throw new UnauthorizedError('User not authenticated');
    }

    const { id: featureId } = request.params;
    const { type } = request.body;

    const vote = await this.voteService.vote(featureId, request.user.userId, type);
    reply.status(200).send(vote);
  }

  async removeVote(
    request: FastifyRequest<{ Params: VoteParams }>,
    reply: FastifyReply
  ): Promise<void> {
    if (!request.user) {
      throw new UnauthorizedError('User not authenticated');
    }

    const { id: featureId } = request.params;
    await this.voteService.removeVote(featureId, request.user.userId);
    reply.status(200).send({ success: true });
  }

  async getStats(
    request: FastifyRequest<{ Params: VoteParams }>,
    reply: FastifyReply
  ): Promise<void> {
    const { id: featureId } = request.params;
    const stats = await this.voteService.getVoteStats(featureId);

    reply
      .header('Cache-Control', `public, max-age=${CacheTTL.VOTE_STATS}`)
      .status(200)
      .send(stats);
  }
}
