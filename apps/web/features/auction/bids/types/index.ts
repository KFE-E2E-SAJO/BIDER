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
