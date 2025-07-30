import { CategoryValue } from '@/features/category/types';
import { Location } from '@/features/location/types';

export interface AuctionList {
  id: string;
  thumbnail: string;
  title: string;
  address: string;
  bidCount: number;
  bidPrice: number;
  auctionEndAt: string;
  auctionStatus: string;
  createdAt: string;
}

export interface AuctionListResponse {
  data: AuctionList[];
  nextOffset: number | null;
}

export interface AuctionListError {
  message: string;
  code?: string;
  status: number;
}

export type AuctionSort = 'latest' | 'popular';
export type AuctionFilter = 'deadline-today' | 'exclude-ended';

export interface AuctionListParams {
  search: string;
  cate: CategoryValue;
  sort: AuctionSort;
  filter: AuctionFilter[];
}

export interface AuctionMarkerResponse {
  id: string;
  location: Location;
  thumbnail: string;
}
