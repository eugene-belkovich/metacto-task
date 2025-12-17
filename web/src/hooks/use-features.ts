'use client';

import { useCallback, useState } from 'react';
import { api } from '@/lib/api';
import { useFeaturesStore } from '@/store/features.store';
import type { Feature, CreateFeatureInput, UpdateStatusInput, FeatureFilters } from '@/types/feature';
import type { FeaturesResponse } from '@/types/api';

export function useFeatures() {
  const {
    features,
    loading,
    error,
    filter,
    sortBy,
    page,
    totalPages,
    hasNextPage,
    hasPrevPage,
    setFeatures,
    addFeature,
    updateFeature,
    removeFeature,
    setFilter,
    setSortBy,
    setPage,
    setLoading,
    setError,
  } = useFeaturesStore();

  const [isCreating, setIsCreating] = useState(false);

  const fetchFeatures = useCallback(
    async (filters?: FeatureFilters) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        const currentFilter = filters?.status ?? filter;
        const currentSort = filters?.sort ?? sortBy;
        const currentPage = filters?.page ?? page;

        if (currentFilter) params.set('status', currentFilter);
        if (currentSort) params.set('sort', currentSort);
        params.set('page', String(currentPage));
        params.set('limit', '10');

        const response = await api.get<FeaturesResponse>(`/api/features?${params.toString()}`);
        setFeatures(response.data.data, {
          page: response.data.page,
          totalPages: response.data.totalPages,
          hasNextPage: response.data.hasNextPage,
          hasPrevPage: response.data.hasPrevPage,
        });
        return response.data;
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Failed to fetch features';
        setError(message);
        throw err;
      }
    },
    [filter, sortBy, page, setFeatures, setLoading, setError]
  );

  const fetchFeature = useCallback(async (id: string): Promise<Feature> => {
    const response = await api.get<Feature>(`/api/features/${id}`);
    return response.data;
  }, []);

  const createFeature = useCallback(
    async (data: CreateFeatureInput) => {
      setIsCreating(true);

      try {
        const response = await api.post<Feature>('/api/features', data);
        addFeature(response.data);
        return response.data;
      } finally {
        setIsCreating(false);
      }
    },
    [addFeature]
  );

  const updateStatus = useCallback(
    async (id: string, data: UpdateStatusInput) => {
      const response = await api.patch<Feature>(`/api/features/${id}/status`, data);
      updateFeature(id, response.data);
      return response.data;
    },
    [updateFeature]
  );

  const deleteFeature = useCallback(
    async (id: string) => {
      await api.delete(`/api/features/${id}`);
      removeFeature(id);
    },
    [removeFeature]
  );

  return {
    features,
    loading,
    error,
    filter,
    sortBy,
    page,
    totalPages,
    hasNextPage,
    hasPrevPage,
    isCreating,
    fetchFeatures,
    fetchFeature,
    createFeature,
    updateStatus,
    deleteFeature,
    setFilter,
    setSortBy,
    setPage,
  };
}
