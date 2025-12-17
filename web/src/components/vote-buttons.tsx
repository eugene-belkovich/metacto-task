'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useVote } from '@/hooks/use-vote';
import { useAuthStore } from '@/store/auth.store';

interface VoteButtonsProps {
  featureId: string;
  voteCount: number;
  onVoteChange?: (newCount: number) => void;
}

export function VoteButtons({ featureId, voteCount, onVoteChange }: VoteButtonsProps) {
  const { isAuthenticated } = useAuthStore();
  const { vote, removeVote, isLoading } = useVote();
  const [currentVote, setCurrentVote] = useState<'up' | 'down' | null>(null);
  const [optimisticCount, setOptimisticCount] = useState(voteCount);

  const handleVote = async (type: 'up' | 'down') => {
    if (!isAuthenticated || isLoading) return;

    const previousVote = currentVote;
    const previousCount = optimisticCount;

    if (currentVote === type) {
      setCurrentVote(null);
      setOptimisticCount(type === 'up' ? optimisticCount - 1 : optimisticCount + 1);

      try {
        await removeVote(featureId);
        onVoteChange?.(type === 'up' ? previousCount - 1 : previousCount + 1);
      } catch {
        setCurrentVote(previousVote);
        setOptimisticCount(previousCount);
      }
    } else {
      let newCount = optimisticCount;
      if (previousVote === 'up') newCount -= 1;
      if (previousVote === 'down') newCount += 1;
      if (type === 'up') newCount += 1;
      if (type === 'down') newCount -= 1;

      setCurrentVote(type);
      setOptimisticCount(newCount);

      try {
        await vote(featureId, type);
        onVoteChange?.(newCount);
      } catch {
        setCurrentVote(previousVote);
        setOptimisticCount(previousCount);
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleVote('up')}
        disabled={!isAuthenticated || isLoading}
        className={cn(currentVote === 'up' && 'text-green-600 bg-green-50')}
      >
        <ThumbsUp className="h-4 w-4" />
      </Button>
      <span className="font-semibold text-lg min-w-[2rem] text-center">{optimisticCount}</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleVote('down')}
        disabled={!isAuthenticated || isLoading}
        className={cn(currentVote === 'down' && 'text-red-600 bg-red-50')}
      >
        <ThumbsDown className="h-4 w-4" />
      </Button>
    </div>
  );
}
