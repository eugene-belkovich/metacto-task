'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import type { Vote, VoteType, VoteStats } from '@/types/vote';

export function useVote() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const vote = async (featureId: string, type: VoteType): Promise<Vote> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post<Vote>(`/api/features/${featureId}/vote`, { type });
      return response.data;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to vote';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeVote = async (featureId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await api.delete(`/api/features/${featureId}/vote`);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to remove vote';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getStats = async (featureId: string): Promise<VoteStats> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get<VoteStats>(`/api/features/${featureId}/votes`);
      return response.data;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to get vote stats';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    vote,
    removeVote,
    getStats,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
