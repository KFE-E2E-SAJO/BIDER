import { CategoryValue } from '@/features/category/types';
import { create } from 'zustand';

interface CategoryState {
  selected: CategoryValue;
  setSelected: (value: CategoryValue) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  selected: 'all',
  setSelected: (value) => set({ selected: value }),
}));
