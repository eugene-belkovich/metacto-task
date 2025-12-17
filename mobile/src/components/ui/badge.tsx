import { View, Text, type ViewProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva('rounded-full px-2.5 py-0.5', {
  variants: {
    variant: {
      default: 'bg-gray-100',
      pending: 'bg-yellow-100',
      in_progress: 'bg-blue-100',
      completed: 'bg-green-100',
      rejected: 'bg-red-100',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const textVariants = cva('text-xs font-semibold', {
  variants: {
    variant: {
      default: 'text-gray-800',
      pending: 'text-yellow-800',
      in_progress: 'text-blue-800',
      completed: 'text-green-800',
      rejected: 'text-red-800',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface BadgeProps extends ViewProps, VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
}

export function Badge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <View className={cn(badgeVariants({ variant }), className)} {...props}>
      {typeof children === 'string' ? (
        <Text className={textVariants({ variant })}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}
