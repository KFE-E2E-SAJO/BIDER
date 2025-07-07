import { BidHistory } from '@/entities/bidHistory/model/types';
import { Product } from '@/entities/product/model/types';

export interface Auction {
  auction_id: string;
  created_at: string;
  product_id: string;
  min_price: number;
  winning_bid_id?: string;
  winning_bid_user_id?: string;
  auction_status: string;
  auction_end_at: string;
  updated_at?: string;
}

export interface AuctionWithProduct extends Auction {
  product: Product;
}

export interface AuctionWithBids extends Auction {
  bid_history: BidHistory[];
}

export interface AuctionDetail extends Auction {
  product: Product;
  bid_history: BidHistory[];
  current_highest_bid: number; // 계산된 필드
}
