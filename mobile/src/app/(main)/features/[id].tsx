import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trash2 } from 'lucide-react-native';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/status-badge';
import { VoteButtons } from '@/components/vote-buttons';
import { useFeatures } from '@/hooks/use-features';
import { useAuthStore } from '@/store/auth.store';
import type { Feature } from '@/types/feature';

export default function FeatureDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { fetchFeature, deleteFeature } = useFeatures();
  const [feature, setFeature] = useState<Feature | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const data = await fetchFeature(id);
        setFeature(data);
      } catch {
        setError('Failed to load feature');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, fetchFeature]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Feature',
      'Are you sure you want to delete this feature?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!id) return;
            setIsDeleting(true);
            try {
              await deleteFeature(id);
              router.back();
            } catch {
              setError('Failed to delete feature');
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const isAuthor = isAuthenticated && user?.id === feature?.author.id;

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 px-4 pt-4" edges={['left', 'right']}>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-2/3 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent className="gap-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </SafeAreaView>
    );
  }

  if (error || !feature) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center px-4">
        <Text className="text-red-600 text-center mb-4">
          {error || 'Feature not found'}
        </Text>
        <Button onPress={() => router.back()} variant="outline">
          Go Back
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['left', 'right']}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Card>
          <CardHeader>
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1">
                <Text className="text-xl font-bold text-gray-900">
                  {feature.title}
                </Text>
                <Text className="text-gray-500 mt-1">
                  by {feature.author.name} •{' '}
                  {new Date(feature.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <StatusBadge status={feature.status} />
            </View>
          </CardHeader>
          <CardContent className="gap-6">
            <Text className="text-gray-700 leading-6">{feature.description}</Text>

            <View className="flex-row items-center justify-between pt-4 border-t border-gray-200">
              <VoteButtons
                featureId={feature.id}
                voteCount={feature.voteCount}
                onVoteChange={(newCount) =>
                  setFeature({ ...feature, voteCount: newCount })
                }
              />

              {isAuthor && (
                <Button
                  variant="destructive"
                  size="sm"
                  onPress={handleDelete}
                  isLoading={isDeleting}
                >
                  <View className="flex-row items-center">
                    <Trash2 size={16} color="#ffffff" />
                    <Text className="text-white font-medium ml-2">Delete</Text>
                  </View>
                </Button>
              )}
            </View>
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
