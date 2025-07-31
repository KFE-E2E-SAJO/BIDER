'use client';
import dynamic from 'next/dynamic';
const ListingList = dynamic(() => import('@/features/auction/listings/ui/ListingList'), {
  ssr: false,
});
export default ListingList;
