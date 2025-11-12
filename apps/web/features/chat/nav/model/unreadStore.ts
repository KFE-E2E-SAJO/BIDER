import { create } from 'zustand';

type UnreadState = {
  count: number;
  setCount: (value: number) => void;
  increase: (n?: number) => void;
  decrease: (n?: number) => void;
  reset: () => void;
};

export const useUnreadStore = create<UnreadState>((set) => ({
  count: 0,
  setCount: (value) => set({ count: value }),
  increase: (n = 1) => set((state) => ({ count: state.count + n })),
  decrease: (n = 1) => set((state) => ({ count: Math.max(state.count - n, 0) })),
  reset: () => set({ count: 0 }),
}));
