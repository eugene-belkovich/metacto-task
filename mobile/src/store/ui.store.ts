import { create } from 'zustand';

interface UIState {
  isRefreshing: boolean;
  setRefreshing: (refreshing: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isRefreshing: false,
  setRefreshing: (isRefreshing) => set({ isRefreshing }),
}));
