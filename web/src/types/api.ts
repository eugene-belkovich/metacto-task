import type { Feature } from './feature';
import type { User } from './user';

export interface AuthResponse {
  id: string;
  email: string;
  name: string;
  token: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export type FeaturesResponse = PaginatedResponse<Feature>;
export type UserResponse = User;
