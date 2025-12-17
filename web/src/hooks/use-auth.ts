'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import type { AuthResponse, LoginInput, RegisterInput } from '@/types/api';

export function useAuth() {
  const router = useRouter();
  const { setAuth, logout: storeLogout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post<AuthResponse>('/api/auth/login', data);
      const { token, id, email, name } = response.data;
      setAuth({ id, email, name, createdAt: '', updatedAt: '' }, token);
      router.push('/features');
      return response.data;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post<AuthResponse>('/api/auth/register', data);
      const { token, id, email, name } = response.data;
      setAuth({ id, email, name, createdAt: '', updatedAt: '' }, token);
      router.push('/features');
      return response.data;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Registration failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    storeLogout();
    router.push('/login');
  };

  return {
    login,
    register,
    logout,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
