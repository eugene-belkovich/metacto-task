import { forwardRef } from 'react';
import { View, Text, TextInput, type TextInputProps } from 'react-native';
import { cn } from '@/lib/utils';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <View className="w-full">
        {label && (
          <Text className="text-sm font-medium text-gray-700 mb-1">{label}</Text>
        )}
        <TextInput
          ref={ref}
          className={cn(
            'h-12 w-full rounded-lg border border-gray-300 bg-white px-3 text-base text-gray-900',
            error && 'border-red-500',
            className
          )}
          placeholderTextColor="#9CA3AF"
          {...props}
        />
        {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
      </View>
    );
  }
);

Input.displayName = 'Input';
