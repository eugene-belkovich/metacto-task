import { injectable } from 'inversify';
import mongoose from 'mongoose';
import { VoteModel } from '../models/vote.model';
import {
  IVoteDocument,
  IVoteRepository,
  IVote,
  IVoteStats,
} from '../interfaces/vote.interface';

@injectable()
export class VoteRepository implements IVoteRepository {
  async create(data: Omit<IVote, '_id' | 'createdAt' | 'updatedAt'>): Promise<IVoteDocument> {
    const vote = new VoteModel(data);
    return vote.save();
  }

  async findById(id: string): Promise<IVoteDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return VoteModel.findById(id).exec();
  }

  async findByUserAndFeature(userId: string, featureId: string): Promise<IVoteDocument | null> {
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(featureId)
    ) {
      return null;
    }
    return VoteModel.findOne({
      user: new mongoose.Types.ObjectId(userId),
      feature: new mongoose.Types.ObjectId(featureId),
    }).exec();
  }

  async findByFeature(featureId: string): Promise<IVoteDocument[]> {
    if (!mongoose.Types.ObjectId.isValid(featureId)) {
      return [];
    }
    return VoteModel.find({
      feature: new mongoose.Types.ObjectId(featureId),
    }).exec();
  }

  async update(id: string, data: Partial<IVote>): Promise<IVoteDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return VoteModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }
    const result = await VoteModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async deleteByUserAndFeature(userId: string, featureId: string): Promise<boolean> {
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(featureId)
    ) {
      return false;
    }
    const result = await VoteModel.findOneAndDelete({
      user: new mongoose.Types.ObjectId(userId),
      feature: new mongoose.Types.ObjectId(featureId),
    }).exec();
    return result !== null;
  }

  async getVoteStats(featureId: string): Promise<IVoteStats> {
    if (!mongoose.Types.ObjectId.isValid(featureId)) {
      return {
        featureId,
        upvotes: 0,
        downvotes: 0,
        total: 0,
      };
    }

    const result = await VoteModel.aggregate([
      {
        $match: { feature: new mongoose.Types.ObjectId(featureId) },
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
    ]).exec();

    const stats: IVoteStats = {
      featureId,
      upvotes: 0,
      downvotes: 0,
      total: 0,
    };

    for (const item of result) {
      if (item._id === 'up') {
        stats.upvotes = item.count;
      } else if (item._id === 'down') {
        stats.downvotes = item.count;
      }
    }

    stats.total = stats.upvotes - stats.downvotes;

    return stats;
  }
}
