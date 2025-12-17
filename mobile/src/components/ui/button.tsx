import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  type TouchableOpacityProps,
  View,
} from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'flex-row items-center justify-center rounded-lg',
  {
    variants: {
      variant: {
        default: 'bg-blue-600',
        destructive: 'bg-red-600',
        outline: 'border border-gray-300 bg-transparent',
        secondary: 'bg-gray-200',
        ghost: '',
      },
      size: {
        default: 'h-12 px-4',
        sm: 'h-10 px-3',
        lg: 'h-14 px-6',
        icon: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const textVariants = cva('font-medium', {
  variants: {
    variant: {
      default: 'text-white',
      destructive: 'text-white',
      outline: 'text-gray-900',
      secondary: 'text-gray-900',
      ghost: 'text-gray-700',
    },
    size: {
      default: 'text-base',
      sm: 'text-sm',
      lg: 'text-lg',
      icon: 'text-base',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface ButtonProps
  extends TouchableOpacityProps,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({
  className,
  variant,
  size,
  isLoading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      className={cn(
        buttonVariants({ variant, size }),
        (disabled || isLoading) && 'opacity-50',
        className
      )}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'secondary' || variant === 'ghost' ? '#374151' : '#ffffff'}
          style={{ marginRight: 8 }}
        />
      ) : null}
      {typeof children === 'string' ? (
        <Text className={cn(textVariants({ variant, size }))}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}
