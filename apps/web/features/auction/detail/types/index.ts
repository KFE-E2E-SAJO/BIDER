import { ProductImage } from '@/entities/productImage/model/types';
import { Profiles } from '@/entities/profiles/model/types';
import { BidHistory } from '@/entities/bidHistory/model/types';

export interface AuctionDetailContent {
  auctionId: string;
  productTitle: string;
  productDescription: string;
  images: ProductImage[];
  minPrice: number;
  auctionEndAt: string;
  exhibitUser: Profiles;
  currentHighestBid: number;
  bidHistory: BidHistory[];
}

export type AuctionDetailContentProps = {
  data: AuctionDetailContent;
};

export interface BottomBarProps {
  shortId: string;
  auctionEndAt: string | Date;
  title: string;
  lastPrice: string;
}
