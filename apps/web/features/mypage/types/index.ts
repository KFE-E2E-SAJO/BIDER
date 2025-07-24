import { ReactNode, MouseEvent } from 'react';
export interface BidWithAuction {
  auction: { auction_status: string } | null;
}

export interface ProductWithAuction {
  product_id: string;
  auction: { auction_status: string } | null;
}

export interface useGetProfileParams {
  userId: string;
}

export interface ProfileParams {
  userId: string;
}

export interface MyPageProfileCardProps {
  nickname: string;
  email: string;
  profile_img?: string | null;
}

export interface MyPageMenuListProps {
  address: string;
}

export interface MyPageMenuItemProps {
  label: string;
  href: string;
  rightElement?: ReactNode;
  withBorder?: boolean;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

export interface AuctionCardProps {
  title1: string;
  count1: number;
  title2: string;
  count2: number;
}
export interface MyPageAuctionProps {
  bidCount: number;
  bidProgressCount: number;
  listingCount: number;
  listingProgressCount: number;
}
