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
}

@injectable()
export class FeatureService implements IFeatureService {
  constructor(
    @inject(TYPES.FeatureRepository) private featureRepository: IFeatureRepository,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
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

    return this.serializeFeature(feature, author);
  }

  async findAll(
    filter: IFeatureFilter,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<FeatureResponse>> {
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

    return {
      ...result,
      data: result.data.map((feature) => this.serializeFeatureWithPopulatedAuthor(feature)),
    };
  }

  async findById(id: string): Promise<FeatureResponse> {
    const feature = await this.featureRepository.findByIdWithAuthor(id);
    if (!feature) {
      throw new NotFoundError('Feature not found');
    }

    return this.serializeFeatureWithPopulatedAuthor(feature);
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

    return this.featureRepository.delete(id);
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
}
