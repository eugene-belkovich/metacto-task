import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { StatusBadge } from '@/components/status-badge';
import { VoteButtons } from '@/components/vote-buttons';
import type { Feature } from '@/types/feature';
import { useFeaturesStore } from '@/store/features.store';

interface FeatureCardProps {
  feature: Feature;
}

export function FeatureCard({ feature }: FeatureCardProps) {
  const router = useRouter();
  const updateFeature = useFeaturesStore((state) => state.updateFeature);

  const handleVoteChange = (newCount: number) => {
    updateFeature(feature.id, { voteCount: newCount });
  };

  const handlePress = () => {
    router.push(`/(main)/features/${feature.id}`);
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <Card className="mb-3">
        <CardHeader>
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900" numberOfLines={2}>
                {feature.title}
              </Text>
              <Text className="text-sm text-gray-500 mt-1">by {feature.author.name}</Text>
            </View>
            <StatusBadge status={feature.status} />
          </View>
        </CardHeader>
        <CardContent>
          <Text className="text-gray-600" numberOfLines={2}>
            {feature.description}
          </Text>
        </CardContent>
        <CardFooter className="justify-between">
          <VoteButtons
            featureId={feature.id}
            voteCount={feature.voteCount}
            onVoteChange={handleVoteChange}
          />
          <Text className="text-sm text-gray-500">
            {new Date(feature.createdAt).toLocaleDateString()}
          </Text>
        </CardFooter>
      </Card>
    </TouchableOpacity>
  );
}
