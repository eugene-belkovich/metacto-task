import { create } from 'zustand';
import type { User } from '@/types/user';
import { jwt } from '@/lib/jwt';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user, token) => {
    jwt.setToken(token);
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    jwt.removeToken();
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  initialize: () => {
    const token = jwt.getToken();
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
    jwt.removeToken();
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },
}));
