import { injectable, inject } from 'inversify';
import { TYPES } from '../types/di.types';
import {
  IFeatureRepository,
  IFeatureDocument,
  IFeatureFilter,
  FeatureStatus,
} from '../interfaces/feature.interface';
import { IUserRepository } from '../interfaces/user.interface';
import { PaginatedResult, PaginationOptions } from '../interfaces/repository.interface';
import { ICache } from '../interfaces/cache.interface';
import { CacheKeys, CacheTTL } from '../utils/cache';
import { NotFoundError, ForbiddenError } from '../errors';
import mongoose from 'mongoose';

export interface FeatureResponse {
  id: string;
  title: string;
  description: string;
  status: FeatureStatus;
  author: {
    id: string;
    name: string;
    email: string;
  };
  voteCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFeatureDTO {
  title: string;
  description: string;
  authorId: string;
}

export interface IFeatureService {
  create(data: CreateFeatureDTO): Promise<FeatureResponse>;
  findAll(
    filter: IFeatureFilter,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<FeatureResponse>>;
  findById(id: string): Promise<FeatureResponse>;
  updateStatus(id: string, status: FeatureStatus, userId: string): Promise<FeatureResponse>;
  delete(id: string, userId: string): Promise<boolean>;
  invalidateCache(): Promise<void>;
}

@injectable()
export class FeatureService implements IFeatureService {
  constructor(
    @inject(TYPES.FeatureRepository) private featureRepository: IFeatureRepository,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.Cache) private cache: ICache
  ) {}

  async create(data: CreateFeatureDTO): Promise<FeatureResponse> {
    const author = await this.userRepository.findById(data.authorId);
    if (!author) {
      throw new NotFoundError('Author not found');
    }

    const feature = await this.featureRepository.create({
      title: data.title,
      description: data.description,
      status: 'pending',
      author: new mongoose.Types.ObjectId(data.authorId),
    });

    await this.invalidateListCache();

    return this.serializeFeature(feature, author);
  }

  async findAll(
    filter: IFeatureFilter,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<FeatureResponse>> {
    const cacheKey = CacheKeys.featuresList(
      filter.status || 'all',
      pagination.page || 1,
      pagination.limit || 10,
      pagination.sortBy || 'newest'
    );

    // Try to get from cache first
    const cached = await this.cache.get<PaginatedResult<FeatureResponse>>(cacheKey);
    if (cached) {
      return cached;
    }

    // Map sort parameter to database field
    let sortBy = 'createdAt';
    let sortOrder: 'asc' | 'desc' = 'desc';

    if (pagination.sortBy === 'votes') {
      sortBy = 'voteCount';
      sortOrder = 'desc';
    } else if (pagination.sortBy === 'newest') {
      sortBy = 'createdAt';
      sortOrder = 'desc';
    } else if (pagination.sortBy === 'oldest') {
      sortBy = 'createdAt';
      sortOrder = 'asc';
    }

    const result = await this.featureRepository.findAll(filter, {
      ...pagination,
      sortBy,
      sortOrder,
    });

    const response = {
      ...result,
      data: result.data.map((feature) => this.serializeFeatureWithPopulatedAuthor(feature)),
    };

    // Cache the result
    await this.cache.set(cacheKey, response, CacheTTL.FEATURES_LIST);

    return response;
  }

  async findById(id: string): Promise<FeatureResponse> {
    const cacheKey = CacheKeys.featureById(id);

    // Try to get from cache first
    const cached = await this.cache.get<FeatureResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    const feature = await this.featureRepository.findByIdWithAuthor(id);
    if (!feature) {
      throw new NotFoundError('Feature not found');
    }

    const response = this.serializeFeatureWithPopulatedAuthor(feature);

    // Cache the result
    await this.cache.set(cacheKey, response, CacheTTL.FEATURE_BY_ID);

    return response;
  }

  async updateStatus(
    id: string,
    status: FeatureStatus,
    userId: string
  ): Promise<FeatureResponse> {
    const feature = await this.featureRepository.findById(id);
    if (!feature) {
      throw new NotFoundError('Feature not found');
    }

    // Check if user is the author
    if (feature.author.toString() !== userId) {
      throw new ForbiddenError('Only the author can update the feature status');
    }

    const updatedFeature = await this.featureRepository.update(id, { status });
    if (!updatedFeature) {
      throw new NotFoundError('Feature not found');
    }

    await this.invalidateFeatureCache(id);

    return this.serializeFeatureWithPopulatedAuthor(updatedFeature);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const feature = await this.featureRepository.findById(id);
    if (!feature) {
      throw new NotFoundError('Feature not found');
    }

    // Check if user is the author
    if (feature.author.toString() !== userId) {
      throw new ForbiddenError('Only the author can delete the feature');
    }

    const result = await this.featureRepository.delete(id);

    await this.invalidateFeatureCache(id);

    return result;
  }

  private serializeFeature(
    feature: IFeatureDocument,
    author: { _id: mongoose.Types.ObjectId; name: string; email: string }
  ): FeatureResponse {
    return {
      id: feature._id.toString(),
      title: feature.title,
      description: feature.description,
      status: feature.status,
      author: {
        id: author._id.toString(),
        name: author.name,
        email: author.email,
      },
      voteCount: feature.voteCount,
      createdAt: feature.createdAt,
      updatedAt: feature.updatedAt,
    };
  }

  private serializeFeatureWithPopulatedAuthor(feature: IFeatureDocument): FeatureResponse {
    const author = feature.author as unknown as {
      _id: mongoose.Types.ObjectId;
      name: string;
      email: string;
    };

    return {
      id: feature._id.toString(),
      title: feature.title,
      description: feature.description,
      status: feature.status,
      author: {
        id: author._id?.toString() || feature.author.toString(),
        name: author.name || '',
        email: author.email || '',
      },
      voteCount: feature.voteCount,
      createdAt: feature.createdAt,
      updatedAt: feature.updatedAt,
    };
  }

  // Cache invalidation methods
  private async invalidateListCache(): Promise<void> {
    // Get all cache keys and delete those matching features:list:*
    const keys = await this.cache.keys();
    const listKeys = keys.filter((key) => key.startsWith('features:list:'));
    if (listKeys.length > 0) {
      await this.cache.del(listKeys);
    }
  }

  private async invalidateFeatureCache(featureId: string): Promise<void> {
    // Invalidate specific feature cache
    await this.cache.del(CacheKeys.featureById(featureId));
    // Also invalidate list cache as the feature data changed
    await this.invalidateListCache();
  }

  async invalidateCache(): Promise<void> {
    // Invalidate all feature-related cache
    const keys = await this.cache.keys();
    const featureKeys = keys.filter((key) => key.startsWith('features:'));
    if (featureKeys.length > 0) {
      await this.cache.del(featureKeys);
    }
  }
}
