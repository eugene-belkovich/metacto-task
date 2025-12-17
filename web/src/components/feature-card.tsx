'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { StatusBadge } from '@/components/status-badge';
import { VoteButtons } from '@/components/vote-buttons';
import type { Feature } from '@/types/feature';
import { useFeaturesStore } from '@/store/features.store';

interface FeatureCardProps {
  feature: Feature;
}

export function FeatureCard({ feature }: FeatureCardProps) {
  const updateFeature = useFeaturesStore((state) => state.updateFeature);

  const handleVoteChange = (newCount: number) => {
    updateFeature(feature.id, { voteCount: newCount });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <Link href={`/features/${feature.id}`}>
              <CardTitle className="hover:text-blue-600 cursor-pointer">{feature.title}</CardTitle>
            </Link>
            <CardDescription className="mt-1">by {feature.author.name}</CardDescription>
          </div>
          <StatusBadge status={feature.status} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 line-clamp-2">{feature.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <VoteButtons
          featureId={feature.id}
          voteCount={feature.voteCount}
          onVoteChange={handleVoteChange}
        />
        <span className="text-sm text-gray-500">
          {new Date(feature.createdAt).toLocaleDateString()}
        </span>
      </CardFooter>
    </Card>
  );
}
