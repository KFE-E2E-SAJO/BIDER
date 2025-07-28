import { Step } from '@/features/location/types';
import { create } from 'zustand';

type LocationState = {
  step: Step;
  setStep: (step: Step) => void;
  goNext: () => void;
};

export const useLocationStore = create<LocationState>((set) => ({
  step: 'intro',
  goNext: () =>
    set((state) => ({
      step: state.step === 'intro' ? 'confirm' : state.step === 'confirm' ? 'success' : state.step,
    })),
  setStep: (step) => set({ step }),
}));
