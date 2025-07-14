import { Location, Step } from '@/features/location/types';
import { create } from 'zustand';

type LocationState = {
  step: Step;
  goNext: () => void;
  userLocation: Location | null;
  userAddress: string | null;
  setUserLocation: (location: Location) => void;
  setUserAddress: (address: string) => void;
};

export const useLocationStore = create<LocationState>((set) => ({
  step: 'intro',
  goNext: () =>
    set((state) => ({
      step: state.step === 'intro' ? 'confirm' : state.step === 'confirm' ? 'success' : state.step,
    })),
  userLocation: null,
  userAddress: null,
  setUserLocation: (location) => set({ userLocation: location }),
  setUserAddress: (address) => set({ userAddress: address }),
}));
