'use client';

import { useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FeatureCard } from '@/components/feature-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useFeatures } from '@/hooks/use-features';
import type { FeatureSort, FeatureStatus } from '@/types/feature';

const sortOptions: { value: FeatureSort; label: string }[] = [
  { value: 'votes', label: 'Most Votes' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
];

const statusOptions: { value: FeatureStatus | ''; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' },
];

export function FeatureList() {
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
    fetchFeatures,
    setFilter,
    setSortBy,
    setPage,
  } = useFeatures();

  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  const handleSortChange = (newSort: FeatureSort) => {
    setSortBy(newSort);
    fetchFeatures({ sort: newSort, page: 1 });
  };

  const handleFilterChange = (newFilter: FeatureStatus | '') => {
    const filterValue = newFilter || undefined;
    setFilter(filterValue);
    fetchFeatures({ status: filterValue, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchFeatures({ page: newPage });
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => fetchFeatures()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          {sortOptions.map((option) => (
            <Button
              key={option.value}
              variant={sortBy === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSortChange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              variant={(filter || '') === option.value ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => handleFilterChange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-6 border rounded-lg">
              <Skeleton className="h-6 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : features.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No features found</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {features.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={!hasPrevPage}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={!hasNextPage}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
