import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, Mail, User } from 'lucide-react-native';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useAuthStore } from '@/store/auth.store';

export default function ProfileScreen() {
  const { logout } = useAuth();
  const { user } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 px-4 pt-4" edges={['left', 'right']}>
      <Card>
        <CardHeader>
          <View className="items-center">
            <View className="w-20 h-20 rounded-full bg-blue-100 items-center justify-center mb-4">
              <User size={40} color="#2563eb" />
            </View>
            <Text className="text-xl font-bold text-gray-900">
              {user?.name || 'User'}
            </Text>
          </View>
        </CardHeader>
        <CardContent className="gap-4">
          <View className="flex-row items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail size={20} color="#6b7280" />
            <Text className="text-gray-700">{user?.email || 'No email'}</Text>
          </View>
          <Button variant="destructive" onPress={handleLogout} className="mt-4">
            <View className="flex-row items-center">
              <LogOut size={18} color="#ffffff" />
              <Text className="text-white font-medium ml-2">Logout</Text>
            </View>
          </Button>
        </CardContent>
      </Card>
    </SafeAreaView>
  );
}
