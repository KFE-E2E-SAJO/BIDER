export interface ListingListParams {
  userId: string;
  filter: 'all' | 'pending' | 'progress' | 'win' | 'fail';
}
export interface AuctionListingsTabsProps {
  userId: string;
}

export interface ListingData {
  product_id: string;
  created_at: string;
  exhibit_user_id: string;
  title: string;
  description: string;
  updated_at: string | null;
  latitude: number;
  longitude: number;
  category: string;
  address: string;
  product_image: {
    [key: string]: string;
  }[];
  pending_auction: {
    [key: string]: any;
  }[];
  auction: {
    [key: string]: any;
  }[];
}
