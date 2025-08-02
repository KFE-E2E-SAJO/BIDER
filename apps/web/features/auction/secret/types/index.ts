import { BidHistoryWithUserNickname } from '@/entities/bidHistory/model/types';

export interface CheckHighestBidOptions {
  auctionId: string;
  auctionEndAt: string;
  bidCnt: number;
  onSuccess: (history: BidHistoryWithUserNickname[]) => void;
  alertTimeLimit: () => Promise<void>;
  alertNotEnoughPoint: () => Promise<void>;
  confirmSpendPoints: () => Promise<boolean>;
}
