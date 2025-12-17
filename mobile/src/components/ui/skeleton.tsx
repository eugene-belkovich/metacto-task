import { View, type ViewProps } from 'react-native';
import { cn } from '@/lib/utils';

interface SkeletonProps extends ViewProps {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return <View className={cn('rounded-md bg-gray-200', className)} {...props} />;
}
