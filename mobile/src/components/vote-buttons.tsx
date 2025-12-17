import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ThumbsUp, ThumbsDown } from 'lucide-react-native';
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
    <View className="flex-row items-center gap-2">
      <TouchableOpacity
        onPress={() => handleVote('up')}
        disabled={!isAuthenticated || isLoading}
        className={cn(
          'p-2 rounded-lg',
          currentVote === 'up' && 'bg-green-50'
        )}
        activeOpacity={0.7}
      >
        <ThumbsUp
          size={20}
          color={currentVote === 'up' ? '#16a34a' : '#6b7280'}
        />
      </TouchableOpacity>
      <Text className="font-semibold text-lg min-w-[32px] text-center">
        {optimisticCount}
      </Text>
      <TouchableOpacity
        onPress={() => handleVote('down')}
        disabled={!isAuthenticated || isLoading}
        className={cn(
          'p-2 rounded-lg',
          currentVote === 'down' && 'bg-red-50'
        )}
        activeOpacity={0.7}
      >
        <ThumbsDown
          size={20}
          color={currentVote === 'down' ? '#dc2626' : '#6b7280'}
        />
      </TouchableOpacity>
    </View>
  );
}
