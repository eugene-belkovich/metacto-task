import { View, type ViewProps } from 'react-native';
import { cn } from '@/lib/utils';

interface CardProps extends ViewProps {}

export function Card({ className, ...props }: CardProps) {
  return (
    <View
      className={cn('rounded-xl border border-gray-200 bg-white', className)}
      {...props}
    />
  );
}

interface CardHeaderProps extends ViewProps {}

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return <View className={cn('p-4', className)} {...props} />;
}

interface CardContentProps extends ViewProps {}

export function CardContent({ className, ...props }: CardContentProps) {
  return <View className={cn('px-4 pb-4', className)} {...props} />;
}

interface CardFooterProps extends ViewProps {}

export function CardFooter({ className, ...props }: CardFooterProps) {
  return <View className={cn('flex-row items-center px-4 pb-4', className)} {...props} />;
}
