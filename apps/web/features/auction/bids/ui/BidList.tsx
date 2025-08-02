'use client';

import ProductList from '@/features/product/ui/ProductList';
import { useGetBidList } from '@/features/auction/bids/model/useGetBidList';
import Skeleton from '@/features/product/ui/Skeleton';
import { BidListParams } from '@/features/auction/bids/types';

const BidList = ({ userId, filter }: BidListParams) => {
  const { data, isLoading, error } = useGetBidList({ userId, filter });

  if (isLoading) {
    return (
      <div className="p-box">
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    );
  }

  if (error)
    return (
      <div className="p-box typo-body-medium mt-[30px] text-center">내역을 찾을 수 없습니다.</div>
    );
  if (!data || data.length === 0)
    return <div className="p-box typo-body-medium mt-[30px] text-center">내역이 없습니다.</div>;

  return (
    <div className="flex flex-col gap-4 px-4">
      <ProductList data={data} />
    </div>
  );
};

export default BidList;
