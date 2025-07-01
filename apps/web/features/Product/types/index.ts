export interface ProductForList {
  id: string;
  thumbnail: string;
  title: string;
  location: string;
  bidCount: number;
  minPrice: number;
  auctionEndAt: string;
  auctionStatus: string;
  winnerId?: string | null;
  sellerId: string;
}
