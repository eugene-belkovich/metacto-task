'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/status-badge';
import { VoteButtons } from '@/components/vote-buttons';
import { useFeatures } from '@/hooks/use-features';
import { useAuthStore } from '@/store/auth.store';
import type { Feature, FeatureStatus } from '@/types/feature';

interface FeatureDetailProps {
  featureId: string;
}

const statusOptions: FeatureStatus[] = ['pending', 'in_progress', 'completed', 'rejected'];

export function FeatureDetail({ featureId }: FeatureDetailProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { fetchFeature, updateStatus, deleteFeature } = useFeatures();
  const [feature, setFeature] = useState<Feature | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchFeature(featureId);
        setFeature(data);
      } catch {
        setError('Failed to load feature');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [featureId, fetchFeature]);

  const handleStatusChange = async (status: FeatureStatus) => {
    if (!feature) return;
    try {
      const updated = await updateStatus(featureId, { status });
      setFeature(updated);
    } catch {
      setError('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this feature?')) return;
    setIsDeleting(true);
    try {
      await deleteFeature(featureId);
      router.push('/features');
    } catch {
      setError('Failed to delete feature');
      setIsDeleting(false);
    }
  };

  const isAuthor = isAuthenticated && user?.id === feature?.author.id;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-2/3 mb-2" />
          <Skeleton className="h-4 w-1/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  if (error || !feature) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-red-600">{error || 'Feature not found'}</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push('/features')}>
            Back to Features
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{feature.title}</CardTitle>
              <p className="text-gray-500 mt-1">
                by {feature.author.name} • {new Date(feature.createdAt).toLocaleDateString()}
              </p>
            </div>
            <StatusBadge status={feature.status} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-700 whitespace-pre-wrap">{feature.description}</p>

          <div className="flex items-center justify-between pt-4 border-t">
            <VoteButtons
              featureId={feature.id}
              voteCount={feature.voteCount}
              onVoteChange={(newCount) => setFeature({ ...feature, voteCount: newCount })}
            />

            {isAuthor && (
              <div className="flex items-center gap-4">
                <select
                  value={feature.status}
                  onChange={(e) => handleStatusChange(e.target.value as FeatureStatus)}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.replace('_', ' ')}
                    </option>
                  ))}
                </select>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  isLoading={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
