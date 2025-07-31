'use client';
import dynamic from 'next/dynamic';
const BidList = dynamic(() => import('@/features/auction/bids/ui/BidList'), { ssr: false });
export default BidList;
