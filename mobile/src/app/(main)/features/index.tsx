import { useEffect, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FeatureCard } from '@/components/feature-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
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

export default function FeaturesScreen() {
  const {
    features,
    loading,
    error,
    filter,
    sortBy,
    fetchFeatures,
    setFilter,
    setSortBy,
  } = useFeatures();

  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  const handleRefresh = useCallback(() => {
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

  const renderHeader = () => (
    <View className="mb-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-3"
      >
        <View className="flex-row gap-2 px-1">
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => handleSortChange(option.value)}
              className={`px-3 py-2 rounded-lg ${
                sortBy === option.value ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  sortBy === option.value ? 'text-white' : 'text-gray-700'
                }`}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row gap-2 px-1">
          {statusOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => handleFilterChange(option.value)}
              className={`px-3 py-2 rounded-lg ${
                (filter || '') === option.value ? 'bg-gray-700' : 'bg-gray-100'
              }`}
            >
              <Text
                className={`text-sm ${
                  (filter || '') === option.value ? 'text-white' : 'text-gray-600'
                }`}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center px-4">
        <Text className="text-red-600 text-center mb-4">{error}</Text>
        <Button onPress={handleRefresh} variant="outline">
          Retry
        </Button>
      </SafeAreaView>
    );
  }

  if (loading && features.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 px-4 pt-4">
        {renderHeader()}
        {[...Array(3)].map((_, i) => (
          <View key={i} className="mb-3 p-4 bg-white rounded-xl border border-gray-200">
            <Skeleton className="h-6 w-2/3 mb-2" />
            <Skeleton className="h-4 w-1/3 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </View>
        ))}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['left', 'right']}>
      <FlatList
        data={features}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FeatureCard feature={item} />}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View className="items-center py-12">
            <Text className="text-gray-500">No features found</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
      />
    </SafeAreaView>
  );
}
