import { ProductImage } from '@/entities/productImage/model/types';
import { Profiles } from '@/entities/profiles/model/types';
import { BidHistoryWithUserNickname } from '@/entities/bidHistory/model/types';
import { Location } from '@/features/location/types';

export interface AuctionDetailContent {
  auctionId: string;
  productTitle: string;
  productCategory: string;
  productDescription: string;
  images: ProductImage[];
  minPrice: number;
  auctionEndAt: string;
  exhibitUser: Profiles;
  currentHighestBid: number;
  bidHistory: BidHistoryWithUserNickname[];
  dealLocation?: Location;
  dealAddress?: string;
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

export interface BiddingStatusBoardProps {
  data: BidHistoryWithUserNickname[];
  auctionId: string;
  onNewHighestBid?: (price: number) => void;
}
