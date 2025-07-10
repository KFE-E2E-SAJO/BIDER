export interface BidHistory {
  bid_id: string;
  bid_at: string;
  auction_id: string;
  bid_user_id: string;
  bid_price: number;
  is_awarded: boolean;
}
