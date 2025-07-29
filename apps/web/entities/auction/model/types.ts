import { BidHistoryWithUserNickname } from '@/entities/bidHistory/model/types';
import { ProductWithUserNImages } from '@/entities/product/model/types';

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
  deal_longitude?: number;
  deal_latitude?: number;
  deal_address?: string;
  is_secret: boolean;
}

export interface AuctionDetail extends Auction {
  product: ProductWithUserNImages;
  bid_history: BidHistoryWithUserNickname[];
  current_highest_bid: number;
  bid_cnt: number;
}

export interface AuctionForBid {
  auction_end_at: string;
  auction_status: string;
  min_price: number;
  product: {
    title: string;
  };
}

export type AuctionForList = Pick<
  Auction,
  'auction_id' | 'product_id' | 'auction_status' | 'min_price' | 'auction_end_at' | 'created_at'
>;

export type MapAuction = Pick<Auction, 'auction_id' | 'product_id'>;

export type SecretViewHistory =
  | {
      hasPaid: false;
      isValid: false;
      viewedAt?: never;
    }
  | {
      hasPaid: true;
      isValid: boolean;
      viewedAt: string;
    };
