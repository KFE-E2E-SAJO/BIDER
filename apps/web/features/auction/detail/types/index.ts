import { ProductImage } from '@/entities/productImage/model/types';
import { Profiles } from '@/entities/profiles/model/types';
import { BidHistoryWithUserNickname } from '@/entities/bidHistory/model/types';

export interface AuctionDetailContent {
  auctionId: string;
  productTitle: string;
  productDescription: string;
  images: ProductImage[];
  minPrice: number;
  auctionEndAt: string;
  exhibitUser: Profiles;
  currentHighestBid: number;
  bidHistory: BidHistoryWithUserNickname[];
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
  onNewHighestBid?: (price: number) => void;
}
