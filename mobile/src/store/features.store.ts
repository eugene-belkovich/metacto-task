import { create } from 'zustand';
import type { Feature, FeatureSort, FeatureStatus } from '@/types/feature';

interface PaginationInfo {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface FeaturesState {
  features: Feature[];
  loading: boolean;
  error: string | null;
  filter: FeatureStatus | undefined;
  sortBy: FeatureSort;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  setFeatures: (features: Feature[], pagination: PaginationInfo) => void;
  addFeature: (feature: Feature) => void;
  updateFeature: (id: string, updates: Partial<Feature>) => void;
  removeFeature: (id: string) => void;
  setFilter: (filter: FeatureStatus | undefined) => void;
  setSortBy: (sort: FeatureSort) => void;
  setPage: (page: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useFeaturesStore = create<FeaturesState>((set) => ({
  features: [],
  loading: false,
  error: null,
  filter: undefined,
  sortBy: 'votes',
  page: 1,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,

  setFeatures: (features, pagination) =>
    set({
      features,
      page: pagination.page,
      totalPages: pagination.totalPages,
      hasNextPage: pagination.hasNextPage,
      hasPrevPage: pagination.hasPrevPage,
      loading: false,
      error: null,
    }),

  addFeature: (feature) =>
    set((state) => ({
      features: [feature, ...state.features],
    })),

  updateFeature: (id, updates) =>
    set((state) => ({
      features: state.features.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    })),

  removeFeature: (id) =>
    set((state) => ({
      features: state.features.filter((f) => f.id !== id),
    })),

  setFilter: (filter) => set({ filter, page: 1 }),
  setSortBy: (sortBy) => set({ sortBy, page: 1 }),
  setPage: (page) => set({ page }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
}));
