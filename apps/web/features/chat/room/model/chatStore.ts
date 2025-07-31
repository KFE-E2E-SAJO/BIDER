import { create } from 'zustand';

interface ChatStore {
  nickname: string;
  setNickname: (name: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  nickname: '',
  setNickname: (name) => set({ nickname: name }),
}));
