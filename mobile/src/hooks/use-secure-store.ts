import { useState, useEffect, useCallback } from 'react';
import { secureStore } from '@/lib/secure-store';

export function useSecureStore() {
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await secureStore.getToken();
      setTokenState(storedToken);
      setIsLoading(false);
    };
    loadToken();
  }, []);

  const setToken = useCallback(async (newToken: string) => {
    await secureStore.setToken(newToken);
    setTokenState(newToken);
  }, []);

  const removeToken = useCallback(async () => {
    await secureStore.removeToken();
    setTokenState(null);
  }, []);

  return {
    token,
    isLoading,
    setToken,
    removeToken,
  };
}
