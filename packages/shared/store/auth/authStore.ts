import { create } from 'zustand';

interface AuthState {
  user: { id: string; email: string; nickName: string; address: string } | null;
  setUser: (user: AuthState['user']) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  logout: () => set({ user: null }),
}));
