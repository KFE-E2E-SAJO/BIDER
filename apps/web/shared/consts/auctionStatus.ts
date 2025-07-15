export const AUCTION_STATUS = {
  PENDING: '경매 대기',
  IN_PROGRESS: '경매 중',
  ENDED: '경매 종료',
} as const;

export type AuctionStatus = (typeof AUCTION_STATUS)[keyof typeof AUCTION_STATUS];
