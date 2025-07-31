import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChatStore {
  nickname: string;
  setNickname: (name: string) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      nickname: '',
      setNickname: (name) => set({ nickname: name }),
    }),
    {
      name: 'chat-storage',
    }
  )
);
