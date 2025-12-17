import mongoose from 'mongoose';

export type VoteType = 'up' | 'down';

export interface IVote {
  _id: mongoose.Types.ObjectId;
  feature: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  type: VoteType;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVoteDocument extends IVote, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}

export interface IVoteStats {
  featureId: string;
  upvotes: number;
  downvotes: number;
  total: number;
}

export interface IVoteRepository {
  create(data: Omit<IVote, '_id' | 'createdAt' | 'updatedAt'>): Promise<IVoteDocument>;
  findById(id: string): Promise<IVoteDocument | null>;
  findByUserAndFeature(userId: string, featureId: string): Promise<IVoteDocument | null>;
  findByFeature(featureId: string): Promise<IVoteDocument[]>;
  update(id: string, data: Partial<IVote>): Promise<IVoteDocument | null>;
  delete(id: string): Promise<boolean>;
  deleteByUserAndFeature(userId: string, featureId: string): Promise<boolean>;
  getVoteStats(featureId: string): Promise<IVoteStats>;
}
