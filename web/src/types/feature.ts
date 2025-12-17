import type { User } from './user';

export type FeatureStatus = 'pending' | 'in_progress' | 'completed' | 'rejected';

export interface Feature {
  id: string;
  title: string;
  description: string;
  status: FeatureStatus;
  author: Pick<User, 'id' | 'name' | 'email'>;
  voteCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeatureInput {
  title: string;
  description: string;
}

export interface UpdateStatusInput {
  status: FeatureStatus;
}

export type FeatureSort = 'votes' | 'newest' | 'oldest';

export interface FeatureFilters {
  sort?: FeatureSort;
  status?: FeatureStatus;
  page?: number;
  limit?: number;
}
