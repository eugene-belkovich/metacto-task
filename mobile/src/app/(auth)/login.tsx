import { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';

export default function LoginScreen() {
  const { login, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    clearError();
    try {
      await login({ email, password });
    } catch {
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-4 py-8"
          keyboardShouldPersistTaps="handled"
        >
          <Card>
            <CardHeader>
              <Text className="text-2xl font-bold text-gray-900">Login</Text>
              <Text className="text-gray-500 mt-1">
                Enter your credentials to access your account
              </Text>
            </CardHeader>
            <CardContent className="gap-4">
              {error && (
                <View className="p-3 bg-red-50 rounded-lg">
                  <Text className="text-sm text-red-600">{error}</Text>
                </View>
              )}
              <Input
                label="Email"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              <Input
                label="Password"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
              />
              <Button onPress={handleSubmit} isLoading={isLoading} className="mt-2">
                Login
              </Button>
              <View className="flex-row justify-center mt-4">
                <Text className="text-gray-600">Don't have an account? </Text>
                <Link href="/(auth)/register" asChild>
                  <TouchableOpacity>
                    <Text className="text-blue-600 font-medium">Register</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </CardContent>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
