export interface ProductForList {
  id: string;
  thumbnail: string;
  title: string;
  // address: string;
  bidCount: number;
  minPrice: number;
  auctionEndAt: string;
  auctionStatus: string;
  winnerId?: string | null;
  sellerId: string;
  isAwarded: boolean;
  isPending: boolean;
}
