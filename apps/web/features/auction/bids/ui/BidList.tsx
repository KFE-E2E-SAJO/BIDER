'use client';

import ProductList from '@/features/product/ui/ProductList';
import { useGetBidList } from '@/features/auction/bids/model/useGetBidList';
import Loading from '@/shared/ui/Loading/Loading';

export interface BidListProps {
  filter: 'all' | 'progress' | 'win' | 'fail';
  userId: string;
}

const BidList = ({ userId, filter }: BidListProps) => {
  const { data, isLoading, error } = useGetBidList({ userId, filter });
  if (isLoading || error || !data) return <Loading />;

  return (
    <div className="flex flex-col gap-4 px-4">
      <ProductList data={data} />
    </div>
  );
};

export default BidList;
