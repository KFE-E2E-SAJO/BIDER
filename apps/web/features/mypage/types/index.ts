export interface BidWithAuction {
  auction: { auction_status: string } | null;
}

export interface ProductWithAuction {
  product_id: string;
  auction: { auction_status: string } | null;
}
