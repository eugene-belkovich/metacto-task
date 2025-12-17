import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useFeatures } from '@/hooks/use-features';

export default function NewFeatureScreen() {
  const router = useRouter();
  const { createFeature, isCreating } = useFeatures();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setError(null);

    try {
      await createFeature({ title, description });
      router.replace('/(main)/features');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to create feature';
      setError(message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ padding: 16 }}
          keyboardShouldPersistTaps="handled"
        >
          <Card>
            <CardHeader>
              <Text className="text-xl font-bold text-gray-900">Create Feature</Text>
              <Text className="text-gray-500 mt-1">
                Submit a new feature request for voting
              </Text>
            </CardHeader>
            <CardContent className="gap-4">
              {error && (
                <View className="p-3 bg-red-50 rounded-lg">
                  <Text className="text-sm text-red-600">{error}</Text>
                </View>
              )}
              <Input
                label="Title"
                placeholder="Short, descriptive title"
                value={title}
                onChangeText={setTitle}
                maxLength={200}
              />
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Description
                </Text>
                <TextInput
                  className="min-h-[120px] w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-base text-gray-900"
                  placeholder="Explain the feature in detail..."
                  placeholderTextColor="#9CA3AF"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  textAlignVertical="top"
                  maxLength={2000}
                />
              </View>
              <Button onPress={handleSubmit} isLoading={isCreating} className="mt-2">
                Create Feature
              </Button>
            </CardContent>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
