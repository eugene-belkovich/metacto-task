import { create } from 'zustand';
import type { User } from '@/types/user';
import { secureStore } from '@/lib/secure-store';
import { jwt } from '@/lib/jwt';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: async (user, token) => {
    await secureStore.setToken(token);
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    await secureStore.removeToken();
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  initialize: async () => {
    const token = await secureStore.getToken();
    if (token && !jwt.isExpired(token)) {
      const payload = jwt.decode<{ userId: string; email: string }>(token);
      if (payload) {
        set({
          token,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }
    }
    await secureStore.removeToken();
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },
}));
