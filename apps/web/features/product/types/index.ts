export interface ProductList {
  id: string;
  thumbnail: string;
  title: string;
  address: string;
  bidCount: number;
  minPrice: number;
  auctionEndAt: string;
  auctionStatus: string;
  winnerId?: string | null;
  sellerId: string;
  isAwarded: boolean;
  isPending?: boolean;
}

export interface ProductListError {
  message: string;
  code?: string;
  status: number;
}

export interface ProductListParams {
  userId: string;
  search?: string;
  cate?: string;
}
