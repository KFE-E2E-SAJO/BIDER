export interface BidDialogProps {
  shortId: string;
  auctionEndAt: string | Date;
  title: string;
  lastPrice: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface BidRequest {
  bidPrice: number;
  userId: string;
}

export interface BidResponse {
  message?: string;
  error?: string;
  bidData: {
    bid_id: string;
    bid_price: number;
    bid_at: string;
    product_title: string;
    bid_end_at: string;
  };
}

export type SubmitBidContext = {
  onSuccess?: () => void;
};

export interface BidListParams {
  userId: string;
  filter: 'all' | 'progress' | 'win' | 'fail';
}
export interface BidData {
  bid_id: string;
  is_awarded: boolean;
  bid_price: number;

  auction: {
    auction_id: string;
    auction_status: string;
    auction_end_at: string;
    winning_bid_user_id: string | null;

    product: {
      product_id: string;
      title: string;
      exhibit_user_id: string;
      latitude: number;
      longitude: number;
      address: string | null;

      product_image: {
        image_url: string;
        order_index: number;
      }[];
    };
  };
}
export interface BidDataWithStats extends BidData {
  bidCount: number;
  maxPrice: number;
}

export interface AuctionBidTabsProps {
  userId: string;
}
