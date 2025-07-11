import { create } from 'zustand';

type BidInfo = {
  bidId: string;
  title: string;
  bid_end_at: string;
  bid_price: number;
};

type BidStore = {
  bidInfo: BidInfo | null;
  setBidInfo: (info: BidInfo | null) => void;
};

export const useBidStore = create<BidStore>((set) => ({
  bidInfo: null,
  setBidInfo: (info) => set({ bidInfo: info }),
}));
