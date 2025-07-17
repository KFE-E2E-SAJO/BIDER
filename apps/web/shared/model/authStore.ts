import { create } from 'zustand';

interface AuthState {
  user: { id: string; email: string; nickName: string; address: string } | null;
  setUser: (user: AuthState['user']) => void;
  updateAddress: (address: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
  updateAddress: (address) =>
    set((state) => ({
      user: {
        ...state.user!,
        address,
      },
    })),
}));
