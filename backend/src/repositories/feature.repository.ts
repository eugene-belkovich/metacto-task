import { injectable } from 'inversify';
import mongoose from 'mongoose';
import { FeatureModel } from '../models/feature.model';
import {
  IFeatureDocument,
  IFeatureRepository,
  IFeature,
  IFeatureFilter,
} from '../interfaces/feature.interface';
import { PaginatedResult, PaginationOptions } from '../interfaces/repository.interface';

@injectable()
export class FeatureRepository implements IFeatureRepository {
  async create(
    data: Omit<IFeature, '_id' | 'createdAt' | 'updatedAt' | 'voteCount'>
  ): Promise<IFeatureDocument> {
    const feature = new FeatureModel(data);
    return feature.save();
  }

  async findById(id: string): Promise<IFeatureDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return FeatureModel.findById(id).exec();
  }

  async findByIdWithAuthor(id: string): Promise<IFeatureDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return FeatureModel.findById(id).populate('author', '-password').exec();
  }

  async findAll(
    filter: IFeatureFilter,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<IFeatureDocument>> {
    const query: Record<string, unknown> = {};

    if (filter.status) {
      query.status = filter.status;
    }

    if (filter.authorId) {
      query.author = new mongoose.Types.ObjectId(filter.authorId);
    }

    const sortField = pagination.sortBy || 'createdAt';
    const sortOrder = pagination.sortOrder === 'asc' ? 1 : -1;
    const sort: Record<string, 1 | -1> = { [sortField]: sortOrder };

    const skip = (pagination.page - 1) * pagination.limit;

    const [data, total] = await Promise.all([
      FeatureModel.find(query)
        .populate('author', '-password')
        .sort(sort)
        .skip(skip)
        .limit(pagination.limit)
        .exec(),
      FeatureModel.countDocuments(query).exec(),
    ]);

    const totalPages = Math.ceil(total / pagination.limit);

    return {
      data,
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages,
      hasNextPage: pagination.page < totalPages,
      hasPrevPage: pagination.page > 1,
    };
  }

  async update(id: string, data: Partial<IFeature>): Promise<IFeatureDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return FeatureModel.findByIdAndUpdate(id, data, { new: true })
      .populate('author', '-password')
      .exec();
  }

  async updateVoteCount(id: string, increment: number): Promise<IFeatureDocument | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return FeatureModel.findByIdAndUpdate(
      id,
      { $inc: { voteCount: increment } },
      { new: true }
    ).exec();
  }

  async delete(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }
    const result = await FeatureModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async count(filter?: IFeatureFilter): Promise<number> {
    const query: Record<string, unknown> = {};

    if (filter?.status) {
      query.status = filter.status;
    }

    if (filter?.authorId) {
      query.author = new mongoose.Types.ObjectId(filter.authorId);
    }

    return FeatureModel.countDocuments(query).exec();
  }
}
