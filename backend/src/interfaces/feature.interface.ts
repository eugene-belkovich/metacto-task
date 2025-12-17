import mongoose from 'mongoose';
import { PaginatedResult, PaginationOptions } from './repository.interface';

export type FeatureStatus = 'pending' | 'in_progress' | 'completed' | 'rejected';

export interface IFeature {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  status: FeatureStatus;
  author: mongoose.Types.ObjectId;
  voteCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFeatureDocument extends IFeature, mongoose.Document {
  _id: mongoose.Types.ObjectId;
}

export interface IFeatureFilter {
  status?: FeatureStatus;
  authorId?: string;
}

export interface IFeatureRepository {
  create(data: Omit<IFeature, '_id' | 'createdAt' | 'updatedAt' | 'voteCount'>): Promise<IFeatureDocument>;
  findById(id: string): Promise<IFeatureDocument | null>;
  findByIdWithAuthor(id: string): Promise<IFeatureDocument | null>;
  findAll(
    filter: IFeatureFilter,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<IFeatureDocument>>;
  update(id: string, data: Partial<IFeature>): Promise<IFeatureDocument | null>;
  updateVoteCount(id: string, increment: number): Promise<IFeatureDocument | null>;
  delete(id: string): Promise<boolean>;
  count(filter?: IFeatureFilter): Promise<number>;
}
