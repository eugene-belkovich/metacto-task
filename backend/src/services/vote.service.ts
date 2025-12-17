import { injectable, inject } from 'inversify';
import mongoose from 'mongoose';
import { TYPES } from '../types/di.types';
import { IVoteRepository, VoteType, IVoteStats, IVoteDocument } from '../interfaces/vote.interface';
import { IFeatureRepository } from '../interfaces/feature.interface';
import { ICache } from '../interfaces/cache.interface';
import { CacheKeys, CacheTTL } from '../utils/cache';
import { NotFoundError } from '../errors';

export interface VoteResponse {
  id: string;
  featureId: string;
  userId: string;
  type: VoteType;
  createdAt: Date;
}

export interface IVoteService {
  vote(featureId: string, userId: string, type: VoteType): Promise<VoteResponse>;
  removeVote(featureId: string, userId: string): Promise<boolean>;
  getVoteStats(featureId: string): Promise<IVoteStats>;
  getUserVote(featureId: string, userId: string): Promise<VoteResponse | null>;
}

@injectable()
export class VoteService implements IVoteService {
  constructor(
    @inject(TYPES.VoteRepository) private voteRepository: IVoteRepository,
    @inject(TYPES.FeatureRepository) private featureRepository: IFeatureRepository,
    @inject(TYPES.Cache) private cache: ICache
  ) {}

  async vote(featureId: string, userId: string, type: VoteType): Promise<VoteResponse> {
    // Check if feature exists
    const feature = await this.featureRepository.findById(featureId);
    if (!feature) {
      throw new NotFoundError('Feature not found');
    }

    // Check if user already voted
    const existingVote = await this.voteRepository.findByUserAndFeature(userId, featureId);

    if (existingVote) {
      // Update existing vote if type changed
      if (existingVote.type !== type) {
        const oldType = existingVote.type;
        const updatedVote = await this.voteRepository.update(existingVote._id.toString(), { type });
        if (!updatedVote) {
          throw new NotFoundError('Vote not found');
        }

        // Update voteCount: remove old vote effect, add new vote effect
        // Old UP -> New DOWN: -2 (remove +1, add -1)
        // Old DOWN -> New UP: +2 (remove -1, add +1)
        const increment = oldType === 'up' ? -2 : 2;
        await this.featureRepository.updateVoteCount(featureId, increment);

        await this.invalidateVoteCache(featureId);

        return this.serializeVote(updatedVote);
      }
      return this.serializeVote(existingVote);
    }

    // Create new vote
    const vote = await this.voteRepository.create({
      feature: new mongoose.Types.ObjectId(featureId),
      user: new mongoose.Types.ObjectId(userId),
      type,
    });

    // Update voteCount on feature
    const increment = type === 'up' ? 1 : -1;
    await this.featureRepository.updateVoteCount(featureId, increment);

    await this.invalidateVoteCache(featureId);

    return this.serializeVote(vote);
  }

  async removeVote(featureId: string, userId: string): Promise<boolean> {
    const existingVote = await this.voteRepository.findByUserAndFeature(userId, featureId);
    if (!existingVote) {
      throw new NotFoundError('Vote not found');
    }

    // Update voteCount before deleting
    const decrement = existingVote.type === 'up' ? -1 : 1;
    await this.featureRepository.updateVoteCount(featureId, decrement);

    const result = await this.voteRepository.deleteByUserAndFeature(userId, featureId);

    await this.invalidateVoteCache(featureId);

    return result;
  }

  async getVoteStats(featureId: string): Promise<IVoteStats> {
    const cacheKey = CacheKeys.voteStats(featureId);

    // Try to get from cache first
    const cached = await this.cache.get<IVoteStats>(cacheKey);
    if (cached) {
      return cached;
    }

    const feature = await this.featureRepository.findById(featureId);
    if (!feature) {
      throw new NotFoundError('Feature not found');
    }

    const stats = await this.voteRepository.getVoteStats(featureId);

    // Cache the result
    await this.cache.set(cacheKey, stats, CacheTTL.VOTE_STATS);

    return stats;
  }

  async getUserVote(featureId: string, userId: string): Promise<VoteResponse | null> {
    const vote = await this.voteRepository.findByUserAndFeature(userId, featureId);
    if (!vote) {
      return null;
    }
    return this.serializeVote(vote);
  }

  private serializeVote(vote: IVoteDocument): VoteResponse {
    return {
      id: vote._id.toString(),
      featureId: vote.feature.toString(),
      userId: vote.user.toString(),
      type: vote.type,
      createdAt: vote.createdAt,
    };
  }

  private async invalidateVoteCache(featureId: string): Promise<void> {
    // Invalidate vote stats cache
    await this.cache.del(CacheKeys.voteStats(featureId));

    // Also invalidate feature caches since voteCount changed
    const keys = await this.cache.keys();
    const featureKeys = keys.filter(
      (key) => key.startsWith('features:list:') || key === `features:${featureId}`
    );
    if (featureKeys.length > 0) {
      await this.cache.del(featureKeys);
    }
  }
}
